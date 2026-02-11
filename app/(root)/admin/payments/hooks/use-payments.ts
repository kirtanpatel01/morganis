import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPayments, fetchPaymentStats } from "../api";
import { PaymentFilters } from "../types";

export const PAYMENT_KEYS = {
  list: (filters: PaymentFilters) => ["payments", filters],
  stats: ["payment-stats"],
};

export const usePayments = (filters: PaymentFilters) => {
  return useQuery({
    queryKey: PAYMENT_KEYS.list(filters),
    queryFn: () => fetchPayments(filters),
    // keepPreviousData is deprecated in v5, use placeholderData
    placeholderData: keepPreviousData,
  });
};

export const usePaymentStats = () => {
  return useQuery({
    queryKey: PAYMENT_KEYS.stats,
    queryFn: fetchPaymentStats,
  });
};
