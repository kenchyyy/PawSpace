"use server"


import { Button } from "@/components/ui/Button";

export default async function manageBookingsLayout({children}: {children: React.ReactNode}) {
    return(
        <div className=" h-full w-full flex flex-col ">
            <header className="w-full h-14 bg-slate-200 fixed ">
                <nav className="flex gap-4 pl-4 items-center h-full justify-start">
                    <Button className="bg-slate-600">To Approve</Button>
                    <Button className="bg-slate-600">Stay</Button>
                    <Button className="bg-slate-600">Transfer Requests</Button>
                    <Button className="bg-slate-600">Cancellation Notice</Button>

                </nav>
            </header>
            <div className="w-full h-full pl-10 pr-10 pt-24 lg:pr-20 lg:pl-20 bg-slate-300">
                {children}
            </div>
        </div>

        
    )
}