"use server";

import { createClient } from "@/lib/supabase/server";
import { StoreSettingsValues, ProfileValues } from "./components/settings-schemas";
import { createNotification } from "@/lib/actions/notifications";
import { revalidatePath } from "next/cache";

export async function getStoreSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: store, error } = await supabase
    .from("stores")
    .select("*")
    .eq("admin_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching store settings:", error);
    return null;
  }

  // Transform to match StoreSettingsValues if necessary, 
  // but we aligned schema to DB mostly.
  // DB: name, gstin, address, state_code
  // Schema: name, gstin, address, stateCode
  return {
    name: store.name || "",
    gstin: store.gstin || "",
    address: store.address || "",
    stateCode: store.state_code || "",
    status: store.status || "pending",
  };
}

export async function updateStoreSettings(data: StoreSettingsValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Get current store to find ID and super_admin_id
  const { data: store, error: fetchError } = await supabase
    .from("stores")
    .select("id, super_admin_id, name")
    .eq("admin_id", user.id)
    .single();

  if (fetchError || !store) {
    return { success: false, message: "Store not found" };
  }

  const { error: updateError } = await supabase
    .from("stores")
    .update({
      name: data.name,
      gstin: data.gstin,
      address: data.address,
      state_code: data.stateCode,
    })
    .eq("id", store.id);

  if (updateError) {
    console.error("Error updating store:", updateError);
    return { success: false, message: "Failed to update store settings" };
  }

  // Notify Super Admin
  if (store.super_admin_id) {
    await createNotification(
      store.super_admin_id,
      "Store Updated",
      `Store "${data.name}" (previously "${store.name}") has been updated by the admin.`,
      "store_updated",
      { link: "/super-admin/stores", storeId: store.id }
    );
  }

  revalidatePath("/admin/settings");
  return { success: true, message: "Store settings updated successfully" };
}

export async function getProfileSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    name: user.user_metadata?.name || "",
    email: user.email || "",
  };
}

export async function updateProfileSettings(data: ProfileValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Update user metadata (name)
  // Updating email requires confirmation, so we might skip it or handle it carefully.
  // For now, let's update metadata.
  const { error: updateError } = await supabase.auth.updateUser({
    data: { name: data.name },
    // email: data.email !== user.email ? data.email : undefined 
    // Commenting out email update for simplicity unless requested explicitly with flow
  });

  if (updateError) {
    console.error("Error updating profile:", updateError);
    return { success: false, message: "Failed to update profile" };
  }

  // Notify Super Admin
  // Find super admin via store
  const { data: store } = await supabase
    .from("stores")
    .select("super_admin_id")
    .eq("admin_id", user.id)
    .single();

  if (store?.super_admin_id) {
    await createNotification(
      store.super_admin_id,
      "Profile Updated",
      `Admin "${data.name}" has updated their profile.`,
      "profile_updated",
      { link: "/super-admin/admins", userId: user.id }
    );
  }

  revalidatePath("/admin/settings");
  return { success: true, message: "Profile updated successfully" };
}
