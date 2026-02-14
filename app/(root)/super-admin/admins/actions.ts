"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdminAuth } from "@/lib/supabase/auth-admin";
import { createClient } from "@/lib/supabase/server";
import { Admin, UpdateAdminInput } from "./types";
import { updateAdminSchema } from "./schemas";

export async function getAdmins(
  filters?: { search?: string; status?: string }
): Promise<Admin[]> {
  const supabase = await createClient();

  // 1. Fetch all stores to map admin_id -> store_name
  const { data: stores, error: storesError } = await supabase
    .schema("public")
    .from("stores")
    .select("admin_id, name");

  if (storesError) {
    console.error("Failed to fetch stores:", storesError);
    return [];
  }

  const adminIdToStoreNameMap = new Map<string, string>();
  stores?.forEach((store) => {
    if (store.admin_id) {
      adminIdToStoreNameMap.set(store.admin_id, store.name);
    }
  });

  // 2. Fetch all users (admins) from Supabase Auth
  const { data: { users }, error: usersError } = await supabaseAdminAuth.auth.admin.listUsers();
  
  if (usersError) {
    console.error("Failed to fetch users:", usersError);
    return [];
  }

  let admins = users
    .filter((user) => user.user_metadata?.role === "admin")
    .map((user) => ({
      id: user.id,
      name: user.user_metadata?.name || "Unknown",
      email: user.email || "",
      store_name: adminIdToStoreNameMap.get(user.id) || "-",
    }));

  // Apply search filter manually since listUsers doesn't support complex filtering easily for this use case
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    admins = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchLower) ||
        admin.email.toLowerCase().includes(searchLower) ||
        admin.store_name.toLowerCase().includes(searchLower)
    );
  }

  return admins;
}

export async function updateAdmin(id: string, formData: UpdateAdminInput) {
  const validated = updateAdminSchema.safeParse({
    name: formData.name,
    email: formData.email,
    password: formData.password || "", // password is optional
  });

  if (!validated.success) {
    return { success: false, message: "Invalid input data" };
  }

  const { name, email, password } = validated.data;

  const updates: any = {
    email: email,
    user_metadata: { name: name },
  };

  if (password && password.length > 0) {
    updates.password = password;
  }

  const { data, error } = await supabaseAdminAuth.auth.admin.updateUserById(
    id,
    updates
  );

  if (error) {
    console.error("Failed to update admin:", error);
    return { success: false, message: error.message };
  }
  
  // Also update metadata if needed differently? No, mapped above.

  revalidatePath("/super-admin/admins");
  return { success: true, message: "Admin updated successfully" };
}

export async function deleteAdmin(id: string) {
  const { error } = await supabaseAdminAuth.auth.admin.deleteUser(id);

  if (error) {
    console.error("Failed to delete admin:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/super-admin/admins");
  return { success: true, message: "Admin deleted successfully" };
}
