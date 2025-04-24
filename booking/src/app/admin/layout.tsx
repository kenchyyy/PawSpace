'use client';

import { useEffect, useState, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaHome, FaBox, FaList} from "react-icons/fa";
import SideNavButton from "@/_components/SideNavButton";
import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { usePathname } from "next/navigation";
import { Button } from "@/_components/ui/Button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [expandSideNav, toggleSideNav] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  function handleLogOut() {
    const supabase = createClientSideClient();
    supabase.auth.signOut().then(() => {
      window.location.href = "/login";
    });
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSize = () => {
      if (window.innerWidth >= 1024) {
        if (!isLg) {
          toggleSideNav(false);
          setIsLg(true);
        }
      } else {
        if (isLg) {
          setIsLg(false);
        }
      }
    };

    window.addEventListener("resize", checkSize);
    checkSize();

    return () => window.removeEventListener("resize", checkSize);
  }, [isLg]);

  useEffect(() => {
    if (!expandSideNav) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        toggleSideNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandSideNav]);

  return (
    <div className="h-screen w-screen flex bg-slate-300">
      {/* Sidebar */}
      <nav 
        ref={navRef}
        className={`h-full text-white p-4 space-y-4 shadow-lg cursor-pointer
        ${expandSideNav ? 'w-64 shadow-2xl' : isLg ? 'w-64 shadow-2xl' : 'w-20 shadow-lg'}
        transition-width duration-300 ease-in-out`}>

        <h2 className={`text-2xl font-bold mb-4 transition-opacity duration-300 ${expandSideNav ? 'opacity-100 block' : 'opacity-0 hidden'} lg:block lg:opacity-100`}>
          Pawspace
          <div>
            <Button onClick={handleLogOut}>Log-out</Button>
          </div>
        </h2>

        <SideNavButton 
          icon={FiMenu} 
          text="" 
          onClick={() => toggleSideNav(!expandSideNav)}
          color="purple"
          className={`lg:hidden ${expandSideNav ? 'hidden' : ''}`}
          isCurrent={false}
        />

        <ul className="space-y-4">
          <SideNavButton icon={FaHome} 
            text="Home" 
            isCurrent={pathname === "/admin"} 
            showText={expandSideNav} 
            href="/admin"
            color="purple"
            onClick={() => { 
                toggleSideNav(false); 
              }}
          />

          <SideNavButton 
            icon={FaList} 
            text="Manage Access" 
            isCurrent={pathname === "/admin/manageAccess"} 
            showText={expandSideNav} 
            href="/admin/manageAccess"
            color="purple"
            onClick={() => { 
                toggleSideNav(false); 
              }}
          />

          <SideNavButton 
            icon={FaBox} 
            text="Inbox" 
            isCurrent={pathname === "/admin/inbox"} 
            showText={expandSideNav} 
            href="/admin/inbox"
            color="purple"
            onClick={() => { 
                toggleSideNav(false); 
              }}
          />
        </ul>
      </nav>

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto ${expandSideNav ? 'opacity-20' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
}

