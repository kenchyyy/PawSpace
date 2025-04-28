// for checking user session and whitelisting in admin portal
'use server';

import { createServerSideClient } from "@/lib/supabase/CreateServerSideClient";

interface SessionCheckerProps {
    portal: "admin" | "customer";
}

export default async function SessionChecker({portal}: SessionCheckerProps): Promise<boolean> {
    const supabase = await createServerSideClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return false;
    }

    if (!data) {
        return false;
    }

    if(portal === "admin") {
        const { data: data2, error } = await supabase
            .from('admin_access_users')
            .select('email')
            .eq('email', data.user.email)
            .maybeSingle();

        if (error) {
            return false;
        }

        if (!data2) {
            return false; 
        }
    }
    return true; 
}