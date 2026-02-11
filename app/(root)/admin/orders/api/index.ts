import { Order, OrderFilters, OrderStatus, PaymentMethod } from "../types";

const MOCK_ORDERS: Order[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `ORD-${1000 + i}`,
  customerName: `Customer ${i + 1}`,
  customerEmail: `customer${i + 1}@example.com`,
  phoneNumber: `+12345678${i}`,
  items: [
    { name: "Burger", quantity: Math.floor(Math.random() * 3) + 1, price: 10 },
    { name: "Fries", quantity: Math.floor(Math.random() * 2), price: 5 },
  ].filter((item) => item.quantity > 0),
  totalAmount: Math.floor(Math.random() * 50) + 10,
  status: [
    "pending",
    "accepted",
    "completed",
    "paid_and_completed",
    "cancelled",
  ][Math.floor(Math.random() * 5)] as OrderStatus,
  paymentMethod: ["cash", "online", "card"][
    Math.floor(Math.random() * 3)
  ] as PaymentMethod,
  paymentStatus: (Math.random() > 0.5 ? "paid" : "unpaid") as "paid" | "unpaid",
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 1000000000),
  ).toISOString(),
  address: "123 Main St, City",
}));

export const fetchOrders = async (
  filters: OrderFilters,
): Promise<{ data: Order[]; total: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  let filtered = [...MOCK_ORDERS];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(search) ||
        o.customerName.toLowerCase().includes(search) ||
        o.phoneNumber.includes(search),
    );
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((o) => o.status === filters.status);
  }

  if (filters.paymentMethod && filters.paymentMethod !== "all") {
    filtered = filtered.filter(
      (o) => o.paymentMethod === filters.paymentMethod,
    );
  }

  // Sort by date desc
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = filtered.slice(startIndex, endIndex);

  return { data: paginatedData, total: filtered.length };
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
): Promise<Order> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = MOCK_ORDERS.findIndex((o) => o.id === id);
  if (index === -1) throw new Error("Order not found");

  MOCK_ORDERS[index] = {
    ...MOCK_ORDERS[index],
    status,
    paymentStatus:
      status === "paid_and_completed"
        ? "paid"
        : MOCK_ORDERS[index].paymentStatus,
  };
  return MOCK_ORDERS[index];
};
