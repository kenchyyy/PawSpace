// for checking user session and whitelisting in admin portal
'use server';

import { createServerSideClient } from "@/lib/supabase/CreateServerSideClient";

interface SessionCheckerProps {
    portal: "admin" | "customer";
}

export default async function SessionChecker({portal}: SessionCheckerProps): Promise<{ isValid: boolean; email?: string }> {
    const supabase = await createServerSideClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.error('Session check error:', error);
        return { isValid: false };
    }

    if(portal === "admin") {
        const { data: data2, error } = await supabase
            .from('AdminAccessUsers')
            .select('email')
            .eq('email', user.email)
            .maybeSingle();

        if (adminError || !adminUser) {
            console.error('Admin check error:', adminError);
            return { isValid: false };
        }
    }

    // For both admin and customer, return the email for further use
    return { 
        isValid: true,
        email: user.email 
    }; 
}