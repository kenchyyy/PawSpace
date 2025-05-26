"use server";

import DashboardLayout from "@/_components/DashboardLayout";
import SessionChecker from "@/_components/serverSide/SessionChecker";
import { redirect } from "next/navigation";
import "@/app/globals.css";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCheck = await SessionChecker({ portal: "admin" });

  if (!sessionCheck) {
    redirect("/customer");
  }
  return (
    <DashboardLayout
      buttons={[
        { icon: "FaHome", text: "Home", href: "/admin" },
        { icon: "FaCalendar", text: "Calendar", href: "/admin/calendar" },
        { icon: "FaList", text: "Manage Access", href: "/admin/manageAccess" },
      {icon: "FaBook", text: "Boarding Bookings", href: "/admin/boardBookings"},
      {icon: "FaAddressCard", text: "Grooming Bookings", href: "/admin/groomBookings"},
      {icon: "FaDoorOpen", text: "Rooms", href: "/admin/rooms"}
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
