"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/_components/ui/Button";
import {
  ClipboardList as ToApproveIcon,
  Check as ConfirmedIcon,
  Clock as OngoingIcon,
  CheckCircle as CompletedIcon,
  AlertCircle as CancellationIcon,
  ArrowRight,
} from "lucide-react";

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper function to check if a button is active
  const isActive = (route: string, isExact: boolean = false) => {
    if (isExact) {
      // Remove trailing slashes for comparison
      const normalizedPath = pathname.replace(/\/+$/, '');
      const normalizedRoute = route.replace(/\/+$/, '');
      return normalizedPath === normalizedRoute;
    }
    return pathname.startsWith(route);
  };

  return (
    <nav className="flex gap-4 pl-4 items-center h-full w-full overflow-x-auto">
      <div className="flex gap-4 pl-4 items-center">
        <Button
          className={`${isActive("/admin/groomBookings/", true) ? "bg-violet-800" : "bg-purple-600"} hover:bg-purple-600 flex items-center gap-2`}
          onClick={() => router.push("/admin/groomBookings/")}
        >
          <ToApproveIcon className="w-4 h-4" />
          <span className="hidden sm:inline">To Approve</span>
        </Button>
        <ArrowRight className="w-4 h-4" />
        <Button
          className={`${isActive("/admin/groomBookings/confirmed") ? "bg-violet-800" : "bg-purple-600"} hover:bg-purple-600 flex items-center gap-2`}
          onClick={() => router.push("/admin/groomBookings/confirmed")}
        >
          <ConfirmedIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Confirmed</span>
        </Button>
        <ArrowRight className="w-4 h-4" />
        <Button
          className={`${isActive("/admin/groomBookings/ongoing") ? "bg-violet-800" : "bg-purple-600"} hover:bg-purple-600 flex items-center gap-2`}
          onClick={() => router.push("/admin/groomBookings/ongoing")}
        >
          <OngoingIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Ongoing</span>
        </Button>
        <ArrowRight className="w-4 h-4" />
        <Button
          className={`${isActive("/admin/groomBookings/completed") ? "bg-violet-800" : "bg-purple-600"} hover:bg-purple-600 flex items-center gap-2`}
          onClick={() => router.push("/admin/groomBookings/completed")}
        >
          <CompletedIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Completed</span>
        </Button>
      </div>
      <div className="flex gap-4 pl-4 items-center">
        <Button
          className={`${isActive("/admin/groomBookings/cancellation-notice") ? "bg-violet-800" : "bg-purple-600"} hover:bg-purple-600 flex items-center gap-2`}
          onClick={() => router.push("/admin/groomBookings/cancellation-notice")}
        >
          <CancellationIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Cancellation Notice</span>
        </Button>
      </div>
    </nav>
  );
}
