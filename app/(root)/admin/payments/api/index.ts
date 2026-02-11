import {
  Payment,
  PaymentFilters,
  PaymentStats,
  PaymentStatus,
  PaymentMethod,
} from "../types";

const MOCK_PAYMENTS: Payment[] = Array.from({ length: 50 }).map((_, i) => {
  const statuses: PaymentStatus[] = [
    "completed",
    "completed",
    "completed",
    "pending",
    "failed",
    "refunded",
  ];
  const methods: PaymentMethod[] = ["cash", "credit_card", "online_wallet"];

  return {
    id: `PAY-${1000 + i}`,
    orderId: `ORD-${1000 + i}`,
    customerName: `Customer ${i + 1}`,
    amount: Math.floor(Math.random() * 100) + 10,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    method: methods[Math.floor(Math.random() * methods.length)],
    transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 1000000000),
    ).toISOString(),
  };
});

export const fetchPayments = async (
  filters: PaymentFilters,
): Promise<{ data: Payment[]; total: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  let filtered = [...MOCK_PAYMENTS];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.id.toLowerCase().includes(search) ||
        p.orderId.toLowerCase().includes(search) ||
        p.customerName.toLowerCase().includes(search),
    );
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  if (filters.method && filters.method !== "all") {
    filtered = filtered.filter((p) => p.method === filters.method);
  }

  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Pagination logic
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = filtered.slice(startIndex, endIndex);

  return { data: paginatedData, total: filtered.length };
};

export const fetchPaymentStats = async (): Promise<PaymentStats> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const completed = MOCK_PAYMENTS.filter((p) => p.status === "completed");
  const refunded = MOCK_PAYMENTS.filter((p) => p.status === "refunded");
  const pending = MOCK_PAYMENTS.filter((p) => p.status === "pending");

  return {
    totalRevenue: completed.reduce((acc, curr) => acc + curr.amount, 0),
    dailyRevenue: completed.reduce((acc, curr) => acc + curr.amount / 30, 0), // Mock daily
    pendingPayments: pending.reduce((acc, curr) => acc + curr.amount, 0),
    refundedAmount: refunded.reduce((acc, curr) => acc + curr.amount, 0),
  };
};
