/**
 * Custom Hooks for User data
 * Uses TanStack Query for caching, loading states, and error handling
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/lib/services/user.service";
import type { Database } from "@/types/supabase";

type UserUpdate = Database["public"]["Tables"]["users_profile"]["Update"];

/**
 * Hook to fetch a single user profile
 * @param userId - The UUID of the user to fetch
 * 
 * @example
 * const { data: user, isLoading, error } = useUser('user-uuid');
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const result = await UserService.getProfile(userId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!userId, // Only fetch if userId is provided
  });
}

/**
 * Hook to fetch all users (admin only)
 * 
 * @example
 * const { data: users, isLoading } = useUsers();
 */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await UserService.getAll();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

/**
 * Hook to update a user profile
 * Automatically invalidates the user cache on success
 * 
 * @example
 * const { mutate: updateUser, isPending } = useUpdateUser();
 * updateUser({ userId: 'uuid', updates: { display_name: 'New Name' } });
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: UserUpdate;
    }) => {
      const result = await UserService.updateProfile(userId, updates);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
