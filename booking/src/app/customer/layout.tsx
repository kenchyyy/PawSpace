'use server';

import DashboardLayout from "@/_components/DashboardLayout";
import SessionChecker from "@/_components/serverSide/SessionChecker";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const sessionCheck = await SessionChecker({ portal: "customer" });

  if(!sessionCheck) {
    redirect("/login");
  }

  return (
    <DashboardLayout colorTheme="purple"
    buttons={[
      {icon: "FaHome", text: "Home", href: "/customer"},
      {icon: "FaCalendar", text: "History", href: "/customer/history"},
      {icon: "FaUser", text: "About Us", href: "/customer/about-us"},
    ]}>
      {children}
    </DashboardLayout>
  );
}