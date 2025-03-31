"use server";
import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";

export async function login(email: string, password: string) {
    // Check if user exists
    const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

    //if user does not exist or there is an error, return error
    if (!user || userError) return { error: "Unauthorized" };

    // Check password from `settings` table
    const { data: settings, error: settingsError } = await supabase
    .from("settings")
    .select("admin_password")
    .single();

    if (settingsError) return { error: "Server error" };

    // Compare password (Assuming it's hashed in DB)
    const match = await bcrypt.compare(password, settings.admin_password);
    if (!match) return { error: "Invalid password" };

    return { success: true };
}
