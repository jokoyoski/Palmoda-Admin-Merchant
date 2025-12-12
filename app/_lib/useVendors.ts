import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filterVendors, getVendors} from './vendors';
import {suspendVendor, revokeSuspension} from "./admin"
import { sendMessage } from '../_lib/message';
import { toast } from 'react-toastify';

export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (page: number) => [...vendorKeys.lists(), page] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,
};

// Fetch vendors hook
export function useVendors(page: number = 1) {
  return useQuery({
    queryKey: vendorKeys.list(page),
    queryFn: () => getVendors(page),
    select: (data) => ({
      vendors: data?.data?.data || [],
      totalPages: data?.data?.total_vendors || 1,
      success: data?.success,
    }),
    placeholderData: (prev) => prev, 
  });
}

// Suspend vendor mutation
export function useSuspendVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendorId: string) => suspendVendor(vendorId),
    onMutate: async (vendorId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: vendorKeys.lists() });

      // Snapshot previous value
      const previousVendors = queryClient.getQueriesData({ 
        queryKey: vendorKeys.lists() 
      });

      // Optimistically update all vendor lists
      queryClient.setQueriesData(
        { queryKey: vendorKeys.lists() },
        (old: any) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((v: any) =>
                v._id === vendorId
                  ? { ...v, is_suspended: true, is_active: false }
                  : v
              ),
            },
          };
        }
      );

      return { previousVendors };
    },
    onError: (err, vendorId, context) => {
      // Rollback on error
      if (context?.previousVendors) {
        context.previousVendors.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to suspend vendor');
    },
    onSuccess: () => {
      toast.success('Vendor suspended successfully!');
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

// Revoke suspension mutation
export function useRevokeSuspension() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vendorId: string) => revokeSuspension(vendorId),
    onMutate: async (vendorId) => {
      await queryClient.cancelQueries({ queryKey: vendorKeys.lists() });

      const previousVendors = queryClient.getQueriesData({ 
        queryKey: vendorKeys.lists() 
      });

      queryClient.setQueriesData(
        { queryKey: vendorKeys.lists() },
        (old: any) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((v: any) =>
                v._id === vendorId
                  ? { ...v, is_suspended: false, is_active: true }
                  : v
              ),
            },
          };
        }
      );

      return { previousVendors };
    },
    onError: (err, vendorId, context) => {
      if (context?.previousVendors) {
        context.previousVendors.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to revoke suspension');
    },
    onSuccess: () => {
      toast.success('Vendor suspension revoked!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
  });
}

// Send message mutation
export function useSendMessage() {
  return useMutation({
    mutationFn: ({ 
      vendorId, 
      title, 
      content, 
      messageType 
    }: {
      vendorId: string;
      title: string;
      content: string;
      messageType: string;
    }) => sendMessage(vendorId, title, content, messageType),
    onSuccess: () => {
      toast.success('Message sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
}

export const useFilteredVendors = (
  pageNumber: number,
  search: string,
  businessType: string,
  kyc: string
) => {
  // The query key now includes all filter parameters and the page number
  return useQuery({
    queryKey: ['vendors', pageNumber, search, businessType, kyc],
    queryFn: () => filterVendors(pageNumber, { search, businessType, kyc }),
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page/filters
    staleTime: 1000 * 60, // Data considered fresh for 1 minute
  });
};