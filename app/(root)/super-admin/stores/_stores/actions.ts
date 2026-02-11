"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdminAuth } from "@/lib/supabase/auth-admin";
import type {
  Store,
  CreateStoreInput,
  UpdateStoreInput,
} from "./types";
import { createClient } from "@/lib/supabase/server";

export async function getStores(
  filters?: { search?: string; status?: string }
): Promise<Store[]> {
  console.log("getStores filters:", filters);
  const supabase = await createClient();
  try {
    let query = supabase
      .schema("public")
      .from("stores")
      .select("*");

    if (filters?.search) {
      const s = filters.search;
      // Using .or() to search across multiple columns
      // Note: id is uuid, requires exact match or cast to text if supported by ilike (which it usually is in PG via cast)
      // But for simplicity, we'll try ilike on text fields.
      // Supabase `or` with `ilike` format: column.ilike.value
      query = query.or(`name.ilike.%${s}%,gstin.ilike.%${s}%,state_code.ilike.%${s}%`);
    }

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch stores:", error);
      return [];
    }

    const stores = (data as Store[]) || [];

    // Fetch owner names for each store
    const enrichedStores = await Promise.all(
      stores.map(async (store) => {
        if (!store.admin_id) return store;
        
        try {
          const { data: userData, error } = await supabaseAdminAuth.auth.admin.getUserById(store.admin_id);
          
          if (error || !userData.user) {
            console.error(`Failed to fetch user for store ${store.id}:`, error);
            return store;
          }
          
          return {
            ...store,
            owner_name: userData.user.user_metadata?.name || "Unknown",
          };
        } catch (error) {
          console.error(`Error fetching user for store ${store.id}:`, error);
          return store;
        }
      })
    );

    return enrichedStores;
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return []
  }
}

export async function createStore(formData: CreateStoreInput): Promise<{
  success: boolean;
  message: string;
  data: { store?: Store };
}> {
  const supabase = await createClient();
  const { data: { user: superAdmin } } = await supabase.auth.getUser();
  console.log("super_admin", superAdmin);
  if(!superAdmin) {
    console.error("Failed to get super admin user");
    return { success: false, message: "Failed to get super admin user", data: {} };
  }

  const { name, ownerName, gstin, address, stateCode, adminEmail, adminPassword } =
    formData;
  const { data, error } = await supabaseAdminAuth.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    user_metadata: { name: ownerName, role: "admin" },
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create user:", error);
    return { success: false, message: error.message, data: {} };
  }

  const { data: storeData, error: storeError } = await supabase
    .schema("public")
    .from("stores")
    .insert({
      super_admin_id: superAdmin.id,
      admin_id: data.user.id,
      name,
      gstin,
      address,
      state_code: stateCode,
    })
    .select()
    .single();

  if (storeError) {
    console.error("Failed to create store:", storeError);
    return { success: false, message: storeError.message, data: {} };
  }

  // Send store creation email
  // try {
  //   const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin-login`;
  //   const emailHtml = getWelcomeEmailTemplate({
  //     storeName: name,
  //     adminEmail,
  //     adminPassword,
  //     loginUrl,
  //   });

  //   const { data: emailData, error: emailError } = await resend.emails.send({
  //     from: "Morganis <onboarding@resend.dev>", // TODO: Update with your verified domain
  //     to: adminEmail,
  //     subject: "Welcome to Morganis - Your Store is Ready!",
  //     html: emailHtml,
  //   });

  //   if (emailError) {
  //     console.error("Failed to send welcome email:", emailError);
  //     return { success: false, message: emailError.message, data: {} }
  //   } else {
  //     console.log("Welcome email sent successfully:", emailData);
  //   }
  // } catch (err) {
  //   console.error("Error sending welcome email:", err);
  //   return { success: false, message: "Failed to send welcome email", data: {} }
  // }

  return {
    success: true,
    message: "Store created successfully",
    data: { store: storeData },
  };
}

export async function updateStore(
  data: UpdateStoreInput,
): Promise<{ success: boolean; message: string; store?: Store }> {
  const supabase = await createClient();

  const { id, ...updateData } = data;

  const updates: Record<string, any> = {};
  if (updateData.name) updates.name = updateData.name;
  if (updateData.gstin) updates.gstin = updateData.gstin;
  if (updateData.address) updates.address = updateData.address;
  if (updateData.stateCode) updates.state_code = updateData.stateCode;
  if (updateData.status) updates.status = updateData.status;

  const { data: updatedStore, error } = await supabase
    .schema("public")
    .from("stores")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update store:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/super-admin/stores");

  return {
    success: true,
    message: "Store updated successfully",
    store: updatedStore as Store,
  };
}

export async function deleteStore(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .schema("public")
    .from("stores")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete store:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/super-admin/stores");

  return {
    success: true,
    message: "Store deleted successfully",
  };
}

export async function toggleStoreStatus(
  store: Store,
): Promise<{ success: boolean; message: string; store?: Store }> {
  const supabase = await createClient();

  const newStatus = store.status === "active" ? "inactive" : "active";

  const { data: updatedStore, error: updateError } = await supabase
    .schema("public")
    .from("stores")
    .update({ status: newStatus })
    .eq("id", store.id)
    .select()
    .single();

  if (updateError) {
    console.error("Failed to update store status:", updateError);
    return { success: false, message: updateError.message };
  }

  console.log(`Store ${store.id} status changed to ${newStatus}`);
  revalidatePath("/super-admin/stores");

  return {
    success: true,
    message: `Store ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
    store: updatedStore as Store,
  };
}
