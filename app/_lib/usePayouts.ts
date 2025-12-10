"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllTransactions, 
  approvePayout, 
  rejectPayout,
  fetchTransactionById 
} from "./payouts";

/**
 * Fetch all payout transactions
 */
export const usePayouts = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Fetch a single payout transaction by ID
 */
export const usePayoutById = (id: string) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => fetchTransactionById(id),
    enabled: !!id, // only run when ID exists
  });
};

/**
 * Approve payout mutation
 */
export const useApprovePayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approvePayout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });
};

/**
 * Reject payout mutation
 */
export const useRejectPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectPayout(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });
};
