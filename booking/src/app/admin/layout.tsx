'use client';

import { useEffect, useState, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaHome, FaBox } from "react-icons/fa";
import SideNavButton from "@/components/SideNavButton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [expandSideNav, toggleSideNav] = useState(false);
  const [navBState, setNavBState] = useState('Home');
  const [isLg, setIsLg] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const noLayoutPages = ["/admin/login", "/admin/callback"];
  const isNoLayoutPage = noLayoutPages.includes(pathname);

  function handleLogOut() {
    const supabase = createClientComponentClient();
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

  if (isNoLayoutPage) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-300">
        {children}
      </div>
    );
  }

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
            isCurrent={navBState === "Home"} 
            showText={expandSideNav} 
            href="/admin"
            color="purple"
            onClick={() => { 
                setNavBState("Home"); 
                toggleSideNav(false); 
              }}
          />

          <SideNavButton 
            icon={FaBox} 
            text="Inbox" 
            isCurrent={navBState === "Inbox"} 
            showText={expandSideNav} 
            href="/admin/inbox"
            color="purple"
            onClick={() => { 
                setNavBState("Inbox"); 
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

