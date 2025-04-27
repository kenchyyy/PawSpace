// for checking user session and whitelisting in admin portal
'use server';

import { createServerSideClient } from "@/lib/supabase/CreateServerSideClient";

interface SessionCheckerProps {
    portal: "admin" | "customer";
}

export default async function SessionChecker({portal}: SessionCheckerProps): Promise<boolean> {
    const supabase = await createServerSideClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        return false;
    }

    if (!session) {
        return false;
    }

    if(portal === "admin") {
        const { data, error } = await supabase
            .from('admin_access_users')
            .select('email')
            .eq('email', session.user.email)
            .maybeSingle();

        if (error) {
            return false;
        }

        if (!data) {
            return false; 
        }
    }
    return true; 
}