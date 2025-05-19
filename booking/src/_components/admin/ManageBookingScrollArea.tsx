import { ScrollArea } from "@/_components/ui/scroll-area";
import { forwardRef } from "react";

const ManageBookingScrollArea = forwardRef<HTMLDivElement, { 
  children: React.ReactNode 
}>(({ children }, ref) => {
  return (
    <ScrollArea 
      ref={ref}
      className="flex flex-col w-full h-[calc(100vh-6rem)] bg-slate-400 border-2 border-black rounded-t-2xl shadow-[inset_0_4px_6px_rgba(0.2,0.2,0.2,0.2)]"
    >
      <div className="flex flex-col gap-4 p-4">
        {children}
      </div>
    </ScrollArea>
  );
});

ManageBookingScrollArea.displayName = "ManageBookingScrollArea";

export default ManageBookingScrollArea;