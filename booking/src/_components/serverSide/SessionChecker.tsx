// for checking user session and whitelisting in admin portal
'use server';

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

interface SessionCheckerProps {
    portal: "admin" | "customer";
}

export default async function SessionChecker({portal}: SessionCheckerProps): Promise<boolean> {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session }, error } = await supabase.auth.getSession();

    // if there's an error getting the session, return false which means the user is not authenticated
    if (error) {
        return false;
    }
    // if there's no session, return false which means has not logged in
    // this is the case when the user has not logged in yet or the session has expired
    if (!session) {
        return false;
    }

    // if the portal is admin, check if the user is whitelisted in the admin_whitelist table
    if(portal === "admin") {
        const { data, error } = await supabase
            .from('admin_whitelist')
            .select('*')
            .eq('email', session.user.email)
            .single();

        // if there's an error getting the data, return false which means there was an error in the database operation
        if (error) {
            return false
        }

        // if there's no data, return false which means the user is not whitelisted
        if (!data) {
            return false; 
        }
    }
    return true; 
}