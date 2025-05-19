"use server";

import{ createServerSideClient } from "@/lib/supabase/CreateServerSideClient";

export async function removeAdmin(email: string) : Promise<{ success: boolean; message: string }> {
    const supabase = await createServerSideClient();
    const { error } = await supabase
        .from("AdminAccessUsers")
        .delete()
        .eq("email", email);

    if (error) {
        console.error("Error removing admin:", error);
        return { success: false, message: "Failed to remove admin" };
    }

    return { success: true, message: "Admin removed successfully" };
}

export async function addAdmin(name: string, email: string) : Promise<{ success: boolean; message: string }> {
    const supabase = await createServerSideClient();
    const { error } = await supabase
        .from("AdminAccessUsers")
        .insert([
            { name: name, email: email, role: "admin" }
        ]);

    if (error) {
        console.error("Error adding admin:", error);
        return { success: false, message: "Failed to add admin" };
    }

    return { success: true, message: "Admin added successfully" };
}