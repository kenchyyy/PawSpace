"use server"

import { createServerSideClient } from "@/lib/supabase/CreateServerSideClient";
import AdminAccessTable from "@/components/AdminAccessTable";

type AdminAccessUser = {
  name: string;
  email: string;
  role: string
}

export default async function AdminPage() {
  const supabase = await createServerSideClient();
  const { data: AdminAccessUser, error } = await supabase
    .from("admin_access_users")
    .select("*");
  if (error) {
    return( <div> {error.message} </div>  )
  }

  return (
    <AdminAccessTable data={AdminAccessUser} />
  );
}
