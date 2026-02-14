export interface Admin {
  id: string; // User ID
  name: string; // user_metadata.name
  email: string; // user.email
  store_name: string; // linked store name
}

export type CreateAdminInput = {
  name: string;
  email: string;
  store_name?: string; // Not typically used for creation here, but good to have
};

export type UpdateAdminInput = {
  name: string;
  email: string;
  password?: string;
};
