"use server"

import TopNav from "./topNav";

export default async function manageBookingsLayout({children}: {children: React.ReactNode}) {

    return(
        <div className=" h-full w-full flex flex-col ">
            <header className="w-full h-14 bg-slate-200 fixed ">
                <TopNav/>
            </header>
            <div className="w-full h-full pl-10 pr-10 pt-24 lg:pr-20 lg:pl-20 bg-slate-300">
                {children}
            </div>
        </div>

        
    )
}