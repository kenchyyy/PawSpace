"use server"

import TopNav from "./topNav";

export default async function manageBookingsLayout({children}: {children: React.ReactNode}) {

return (
  <div className="h-full w-full flex flex-col">
    <header
      className="w-full h-14 fixed"
      style={{ backgroundColor : "#2e0249"}} // indigo-900-like, or use "#312e81" for indigo-800
    >
      <TopNav />
    </header>
    <div
      className="w-full h-full px-6 pt-24"
      style={{ backgroundColor: "#312e81", color: "white" }} // indigo-800-like, or use "#3730a3" for indigo-700
    >
      {children}
    </div>
  </div>
);
}