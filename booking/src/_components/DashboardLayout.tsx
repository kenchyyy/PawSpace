'use client';

import React, { useEffect, useState, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaHome, FaBox, FaList, FaCalendar, FaUser, FaAddressCard, FaBook, FaDoorOpen} from "react-icons/fa";
import SideNavButton from "@/_components/SideNavButton";
import { createClientSideClient } from "@/lib/supabase/CreateClientSideClient";
import { usePathname } from "next/navigation";
import { Button } from "@/_components/ui/Button";

interface ButtonData {
    icon: keyof typeof Icons;
    text: string;
    href: string;
  }
  
interface SideNavProps {
  children: React.ReactNode;
  colorTheme: "purple" | "gray";  
  buttons: ButtonData[];
}

const Icons = {
  "FaHome": FaHome,
  "FaList": FaList,
  "FaBox": FaBox,
  "FaCalendar": FaCalendar,
  "FaUser": FaUser,
  "FaAddressCard": FaAddressCard,
  "FaBook": FaBook,
  "FaDoorOpen": FaDoorOpen
}

export default function DashboardLayout({ children, colorTheme , buttons}: SideNavProps) {
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
    <div className={`h-screen w-screen flex
      ${colorTheme === "purple" ? 
        "bg-[linear-gradient(to_top_right,#1a011f,#2b0231,#220127,#240132,#2e0249,#5b0d6d,#921f38,#7a1d31)]" : 
        "bg-slate-300"}`
      }
    >
      {/* Sidebar */}
      <nav 
        ref={navRef}
        className={`h-full text-white space-y-4 shadow-lg cursor-pointer fixed
        ${expandSideNav ? `w-40 shadow-2xl p-4 ${colorTheme === "purple" ? ` bg-violet-950` : `bg-gray-400` }` : isLg ? 'p-4 w-64 shadow-2xl' : 'w-14 shadow-lg pt-4 p-1'}
        transition-width duration-300 ease-in-out z-40`}>

        <h2 className={`text-2xl text-white font-bold mb-4 transition-opacity duration-300 ${expandSideNav ? 'opacity-100 block' : 'opacity-0 hidden'} lg:block lg:opacity-100`}>
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
            {buttons.map((button, index) => (
                <SideNavButton
                    key={index}
                    icon={Icons[button.icon as keyof typeof Icons]}
                    text={button.text}
                    isCurrent={pathname === button.href}
                    showText={expandSideNav}
                    href={button.href}
                    color={colorTheme}
                    onClick={() => { 
                        toggleSideNav(false); 
                      }}
                />))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${expandSideNav ? 'opacity-20' : 'opacity-100'}
        ${expandSideNav ? 'ml-14' : isLg ? 'ml-64' : 'ml-14'}
      `}>
        {children}
      </main>
    </div>
  );
}

