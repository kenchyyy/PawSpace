'use client';

import { useEffect, useState, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaHome, FaUser, FaCalendar } from "react-icons/fa";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SideNavButton from "@/components/SideNavButton";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [expandSideNav, toggleSideNav] = useState(false);
    const [isLg, setIsLg] = useState<null|boolean>(null);
    const navRef = useRef<HTMLDivElement | null>(null);

    const pathname = usePathname();

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
      checkSize(); // Run once on mount
  
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
      <div className="h-screen w-screen flex bg-[linear-gradient(to_top_right,#1a011f,#2b0231,#220127,#240132,#2e0249,#5b0d6d,#921f38,#7a1d31)]">
        {/* Sidebar */}
        <nav 
          ref={navRef}
          className={`h-full text-white p-4 space-y-4 shadow-lg cursor-pointer
          ${expandSideNav ? 'w-64 shadow-2xl' : isLg ? 'w-64 shadow-2xl' : 'w-20 shadow-lg'}
          transition-width duration-300 ease-in-out`}>
  
          <h2 className={`text-2xl font-bold mb-4 transition-opacity duration-300 ${expandSideNav ? 'opacity-100 block' : 'opacity-0 hidden'} lg:block lg:opacity-100`}>
            Pawspace
            <Button onClick={handleLogOut}>Log-out</Button>
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
            {/* Add side navigation buttons here. Use SideNavButton Component */}
            <SideNavButton icon={FaHome} 
              text="Home" 
              isCurrent={pathname === "/customer"} 
              showText={expandSideNav} 
              href="/customer"
              color="purple"
              onClick={() => {toggleSideNav(false)}}
            />

            <SideNavButton 
              icon={FaCalendar} 
              text="History" 
              isCurrent={pathname === "/customer/history"} 
              showText={expandSideNav} 
              href="/customer/history"
              color="purple"
              onClick={() => {toggleSideNav(false)}}
            />

            <SideNavButton 
              icon={FaUser} 
              text="About Us" 
              isCurrent={pathname === "/customer/about-us"} 
              showText={expandSideNav} 
              href="/customer/about-us"
              color="purple"
              onClick={() => {toggleSideNav(false)}}
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
  