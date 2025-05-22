import { ScrollArea } from "@/_components/ui/scroll-area";
import { forwardRef } from "react";

interface ManageBookingScrollAreaProps {
  children: React.ReactNode;
  className?: string;  // <-- add className here
}

const ManageBookingScrollArea = forwardRef<HTMLDivElement, ManageBookingScrollAreaProps>(
  ({ children, className }, ref) => {
    return (
      <ScrollArea
        ref={ref}
        className={`flex flex-col w-full h-[calc(100vh-6rem)] bg-purple-800 border border-purple-600 rounded-t-2xl shadow-inner ${
          className ?? ""
        }`}
      >
        <div className="flex flex-col gap-4 p-6 text-white">{children}</div>
      </ScrollArea>
    );
  }
);

ManageBookingScrollArea.displayName = "ManageBookingScrollArea";

export default ManageBookingScrollArea;
