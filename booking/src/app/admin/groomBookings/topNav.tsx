"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  ClipboardList as ToApproveIcon,
  Check as ConfirmedIcon,
  Clock as OngoingIcon,
  CheckCircle as CompletedIcon,
  AlertCircle as CancellationIcon,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { Button } from "@/_components/ui/Button";

const statusOptions = [
  {
    value: "/admin/groomBookings/",
    label: "Pending",
    icon: ToApproveIcon,
    exact: true,
  },
  {
    value: "/admin/groomBookings/confirmed",
    label: "Confirmed",
    icon: ConfirmedIcon,
    exact: false,
  },
  {
    value: "/admin/groomBookings/ongoing",
    label: "Ongoing",
    icon: OngoingIcon,
    exact: false,
  },
  {
    value: "/admin/groomBookings/completed",
    label: "Completed",
    icon: CompletedIcon,
    exact: false,
  },
  {
    value: "/admin/groomBookings/cancellation-notice",
    label: "Cancelled",
    icon: CancellationIcon,
    exact: false,
  },
];

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string, isExact: boolean = false) => {
    if (isExact) {
      const normalizedPath = pathname.replace(/\/+$/, '');
      const normalizedRoute = route.replace(/\/+$/, '');
      return normalizedPath === normalizedRoute;
    }
    return pathname.startsWith(route);
  };

  // Find the current active status
  const activeStatus = statusOptions.find(option => 
    isActive(option.value, option.exact)
  ) || statusOptions[0];

  return (
    <nav className="flex gap-4 pl-4 items-center h-full w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            aria-label="Booking status filter"
          >
            <activeStatus.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{activeStatus.label}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-purple-700 border-purple-600 text-white">
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={`hover:bg-purple-600 focus:bg-purple-600 cursor-pointer ${
                isActive(option.value, option.exact) ? "bg-violet-800" : ""
              }`}
              onClick={() => router.push(option.value)}
            >
              <div className="flex items-center gap-2">
                <option.icon className="w-4 h-4 text-white" />
                <span>{option.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}