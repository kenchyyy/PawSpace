"use server";
import { adminSupabase } from "../lib/supabase";

export async function addAdminUser(email: string) {
    // Add user to `users` table with role `admin`
  const { error } = await adminSupabase.from("authenticated_users").insert([{ email, role: "admin" }]);

    // Return error if adding user failed otherwise return success
  return error ? { error: "Failed to add user" } : { success: true };
}

export async function getAdminUsers() {
    // Fetch all users from `authenticated_users` table
  const { data, error } = await adminSupabase.from("authenticated_users").select("*");
  return error ? { error: "Failed to fetch users" } : { users: data };
}
