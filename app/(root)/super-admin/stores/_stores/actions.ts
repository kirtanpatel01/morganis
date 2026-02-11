"use server";

import { supabase } from "@/lib/supabase/auth-admin";
import { resend } from "@/lib/resend";
import { getWelcomeEmailTemplate } from "@/lib/email-templates";
import { STORES_DATA } from "./constants";
import type {
  Store,
  CreateStoreInput,
  UpdateStoreInput,
  StoreFilters,
} from "./types";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory store for demo (would be database in production)
let stores = [...STORES_DATA];

/**
 * Fetch all stores with optional filters
 */
export async function getStores(filters?: StoreFilters): Promise<Store[]> {
  await delay(100);

  let result = [...stores];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (store) =>
        store.name.toLowerCase().includes(search) ||
        store.gstin.toLowerCase().includes(search),
    );
  }

  if (filters?.status && filters.status !== "all") {
    result = result.filter((store) => store.status === filters.status);
  }

  return result;
}

/**
 * Get a single store by ID
 */
export async function getStoreById(id: string): Promise<Store | null> {
  await delay(100);
  return stores.find((store) => store.id === id) || null;
}

/**
 * Create a new store
 */
export async function createStore(formData: CreateStoreInput): Promise<{
  success: boolean;
  message: string;
  data: { store?: Store };
}> {
  const { name, gstin, address, stateCode, adminEmail, adminPassword } =
    formData;
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    user_metadata: { name: name, role: "admin" },
    email_confirm: true, 
  });

  if(error) {
    console.error("Failed to create user:", error);
    return { success: false, message: error.message, data: {} }
  }

  const { data: storeData, error: storeError } = await supabase
  .schema("public")
  .from("stores")
  .insert({
    admin_id: data.user.id,
    name,
    gstin,
    address,
    state_code: stateCode,
  })
  .select()
  .single();

  if(storeError) {
    console.error("Failed to create store:", storeError);
    return { success: false, message: storeError.message, data: {} }
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

  return { success: true, message: "Store created successfully", data: { store: storeData } };
}

/**
 * Update a store
 */
export async function updateStore(
  data: UpdateStoreInput,
): Promise<{ success: boolean; message: string; store?: Store }> {
  await delay(200);

  const index = stores.findIndex((store) => store.id === data.id);
  if (index === -1) {
    return { success: false, message: "Store not found" };
  }

  const updatedStore = {
    ...stores[index],
    ...(data.name && { name: data.name }),
    ...(data.gstin && { gstin: data.gstin }),
    ...(data.address && { address: data.address }),
    ...(data.stateCode && { stateCode: data.stateCode }),
    ...(data.status && { status: data.status }),
  };

  stores[index] = updatedStore;
  console.log("Store updated:", updatedStore);

  return {
    success: true,
    message: "Store updated successfully",
    store: updatedStore,
  };
}

/**
 * Delete a store
 */
export async function deleteStore(
  id: string,
): Promise<{ success: boolean; message: string }> {
  await delay(200);

  const index = stores.findIndex((store) => store.id === id);
  if (index === -1) {
    return { success: false, message: "Store not found" };
  }

  const deletedStore = stores[index];
  stores = stores.filter((store) => store.id !== id);
  console.log("Store deleted:", deletedStore);

  return {
    success: true,
    message: `Store "${deletedStore.name}" deleted successfully`,
  };
}

/**
 * Toggle store status (activate/deactivate)
 */
export async function toggleStoreStatus(
  id: string,
): Promise<{ success: boolean; message: string; store?: Store }> {
  await delay(200);

  const index = stores.findIndex((store) => store.id === id);
  if (index === -1) {
    return { success: false, message: "Store not found" };
  }

  const currentStatus = stores[index].status;
  const newStatus = currentStatus === "active" ? "inactive" : "active";

  stores[index] = { ...stores[index], status: newStatus };
  console.log(`Store ${id} status changed to ${newStatus}`);

  return {
    success: true,
    message: `Store ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
    store: stores[index],
  };
}
