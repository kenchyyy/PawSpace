'use server';

import DashboardLayout from "@/_components/DashboardLayout";
import SessionChecker from "@/_components/serverSide/SessionChecker";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const sessionCheck = await SessionChecker({ portal: "admin" });

  if(!sessionCheck) {
    redirect("/customer");
  }
  return (
    <DashboardLayout colorTheme="gray"
    buttons={[
      {icon: "FaHome", text: "Home", href: "/admin"},
      {icon: "FaList", text: "Manage Access", href: "/admin/manageAccess"},
      {icon: "FaBox", text: "Inbox", href: "/admin/inbox"},
    ]}>
      {children}
    </DashboardLayout>
  );
}

