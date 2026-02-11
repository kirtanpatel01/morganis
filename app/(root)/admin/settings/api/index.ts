import { StoreSettings, UserProfile } from "../types";

let MOCK_STORE_SETTINGS: StoreSettings = {
    name: "Morganis Burger Joint",
    description: "Best burgers in town",
    address: "123 Food Street, Tasty City",
    phone: "+1 234 567 890",
    email: "contact@morganis.com",
    currency: "USD",
    taxRate: 10,
};

let MOCK_USER_PROFILE: UserProfile = {
    id: "USR-001",
    name: "Admin User",
    email: "admin@morganis.com",
    role: "admin",
};

export const fetchStoreSettings = async (): Promise<StoreSettings> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_STORE_SETTINGS;
};

export const updateStoreSettings = async (settings: Partial<StoreSettings>): Promise<StoreSettings> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_STORE_SETTINGS = { ...MOCK_STORE_SETTINGS, ...settings };
    return MOCK_STORE_SETTINGS;
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_USER_PROFILE;
};

export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_USER_PROFILE = { ...MOCK_USER_PROFILE, ...profile };
    return MOCK_USER_PROFILE;
};
