"use server"

import TopNav from "./topNav";

export default async function manageBookingsLayout({children}: {children: React.ReactNode}) {

    return(
        <div className=" h-full w-full flex flex-col ">
            <header className="w-full h-14 fixed "
            style={{ backgroundColor : "#2e0249"}}
            >
                <TopNav/>
            </header>
            <div className="w-full h-full px-6 pt-24 "
            style={{ backgroundColor: "#3b0764", color: "white" }}
            >
                {children}
            </div>
        </div>

        
    )
}