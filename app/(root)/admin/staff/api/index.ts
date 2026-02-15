import { Staff, StaffFilters } from "../types";

let MOCK_STAFF: Staff[] = [
  {
    id: "STF-001",
    name: "John Doe",
    email: "john@morganis.com",
    phone: "+1234567890",
    role: "manager",
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: "STF-002",
    name: "Jane Smith",
    email: "jane@morganis.com",
    phone: "+1234567891",
    role: "cashier",
    status: "active",
    joinDate: "2023-02-20",
  },
  {
    id: "STF-003",
    name: "Bob Cook",
    email: "bob@morganis.com",
    phone: "+1234567892",
    role: "kitchen",
    status: "active",
    joinDate: "2023-03-10",
  },
  {
    id: "STF-004",
    name: "Alice Driver",
    email: "alice@morganis.com",
    phone: "+1234567893",
    role: "driver",
    status: "leave",
    joinDate: "2023-04-05",
  },
];

export const fetchStaff = async (filters: StaffFilters): Promise<Staff[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let filtered = [...MOCK_STAFF];

  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (st) =>
        st.name.toLowerCase().includes(s) || st.email.toLowerCase().includes(s),
    );
  }
  if (filters.role && filters.role !== "all") {
    filtered = filtered.filter((st) => st.role === filters.role);
  }
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((st) => st.status === filters.status);
  }
  return filtered;
};

export const createStaff = async (
  staff: Omit<Staff, "id" | "joinDate">,
): Promise<Staff> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newStaff: Staff = {
    ...staff,
    id: `STF-${Date.now()}`,
    joinDate: new Date().toISOString().split("T")[0],
  };
  MOCK_STAFF.push(newStaff);
  return newStaff;
};

export const updateStaff = async ({
  id,
  updates,
}: {
  id: string;
  updates: Partial<Staff>;
}): Promise<Staff> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const idx = MOCK_STAFF.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Staff not found");
  MOCK_STAFF[idx] = { ...MOCK_STAFF[idx], ...updates };
  return MOCK_STAFF[idx];
};

export const deleteStaff = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  MOCK_STAFF = MOCK_STAFF.filter((s) => s.id !== id);
};
