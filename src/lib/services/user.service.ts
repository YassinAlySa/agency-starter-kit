/**
 * Example Service Layer - demonstrating the pattern
 * Replace with your actual services
 */

import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

// Type aliases for cleaner code
type User = Database["public"]["Tables"]["users_profile"]["Row"];
type UserUpdate = Database["public"]["Tables"]["users_profile"]["Update"];

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * User Service - handles all user-related database operations
 * 
 * @example
 * // Get user profile
 * const result = await UserService.getProfile('user-uuid');
 * if (result.success) {
 *   console.log(result.data);
 * }
 */
export const UserService = {
  /**
   * Fetches a user profile by ID
   * @param userId - The UUID of the user
   * @returns ApiResponse with user data or error
   */
  async getProfile(userId: string): Promise<ApiResponse<User>> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  /**
   * Updates a user profile
   * @param userId - The UUID of the user
   * @param updates - Partial user data to update
   * @returns ApiResponse with updated user data or error
   */
  async updateProfile(
    userId: string,
    updates: UserUpdate
  ): Promise<ApiResponse<User>> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users_profile")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  /**
   * Gets all users (admin only - RLS will enforce this)
   * @returns ApiResponse with array of users or error
   */
  async getAll(): Promise<ApiResponse<User[]>> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },
};
