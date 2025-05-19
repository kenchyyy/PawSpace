"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/_components/ui/Button";
import { ArrowRight } from "lucide-react";


export default function TopNav() {

    const router = useRouter();

    return (
        <nav className="flex gap-4 pl-4 items-center h-full w-full overflow-x-auto">
            <div className=" flex gap-4 pl-4 items-center">
                <Button className="bg-slate-600" onClick={() => router.push("/admin/manageBookings/")}>To Approve</Button>
                <ArrowRight/>
                <Button className="bg-slate-600" onClick={() => router.push("/admin/manageBookings/confirmed")}>Confirmed</Button>
                <ArrowRight/>
                <Button className="bg-slate-600" onClick={() => router.push("/admin/manageBookings/onBoarding")}>OnBoarding</Button>
                <ArrowRight/>
                <Button className="bg-slate-600" onClick={() => router.push("/admin/manageBookings/completed")}>Completed</Button>
            </div>
            <div className=" flex gap-4 pl-4 items-center">
                <Button className="bg-slate-600" onClick={() => router.push("/admin/manageBookings/cancellation-notice")}>Cancellation Notice</Button>
            </div>

        </nav>
    )
}