"use client";

import React, { useEffect, useState, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaHome, FaBox, FaList, FaCalendar, FaUser, FaAddressCard, FaBook, FaDoorOpen, FaSignOutAlt} from "react-icons/fa";
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

export default function DashboardLayout({ children, buttons }: SideNavProps) {
  const [expandSideNav, toggleSideNav] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);


  const calendarBackgroundColor = "#2e0249"; // Purple background color
  const calendarTextColor = "white"; // Text color

  function handleLogOut() {
    const supabase = createClientSideClient();
    supabase.auth.signOut().then(() => {
      window.location.href = "/";
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
    <div
      className={`h-screen w-screen flex`}
      style={{
        background:
          "linear-gradient(to top right, #1a011f, #2b0231, #220127, #240132, #2e0249, #5b0d6d, #921f38, #7a1d31)",
      }}
    >
      {/* Sidebar */}
      <nav
        ref={navRef}
        style={{
          backgroundColor: calendarBackgroundColor,
          color: calendarTextColor,
        }}
        className={`h-full flex flex-col justify-between shadow-lg overflow-y-auto  ${
          expandSideNav
            ? "w-64 shadow-2xl"
            : isLg
              ? "w-64 shadow-2xl"
              : "w-20 shadow-lg"
        } transition-width duration-300 ease-in-out`}
      >
        <div className="flex-1 flex flex-col space-y-4 p-4">
          <h2
            className={`text-3xl font-bold mb-4 transition-opacity duration-300 ${
              expandSideNav ? "opacity-100 block" : "opacity-0 hidden"
            } lg:block lg:opacity-100 flex items-center gap-2`} // flex container with spacing
          >
            <div className="flex items-center">
              <img
                src="/favicon.ico"
                alt="Pawspace favicon"
                className="w-16 h-16" // adjust size as needed
              />
              <span style={{ color: "#FBBF24" }}>Pawspace</span>
            </div>
          </h2>

          
          <SideNavButton
            icon={FiMenu}
            text=''
            onClick={() => toggleSideNav(!expandSideNav)}
            color='custom'
            customColor={calendarBackgroundColor}
            textColor={calendarTextColor}
            className={`lg:hidden ${expandSideNav ? "hidden" : ""}`}
            isCurrent={false}
            
          />

          <ul className='space-y-4 pb-4 border-b-2 border-purple-400'>
            {buttons.map((button, index) => (
              <SideNavButton
                key={index}
                icon={Icons[button.icon as keyof typeof Icons]}
                text={button.text}
                href={button.href}
                onClick={() => {
                  toggleSideNav(false);
                }}
                isCurrent={pathname === button.href}
                showText={expandSideNav}
                color='custom'
                customColor={calendarBackgroundColor}
                textColor={calendarTextColor}
              />
            ))}
            
          </ul>
          
            <SideNavButton icon={FaSignOutAlt} isCurrent={false} text="Log-out" onClick={handleLogOut} color="custom"/>
          
            
        </div>

      </nav>


      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${
          mounted && expandSideNav ? "opacity-20" : "opacity-100"
        }`}
        style={{ backgroundColor: "#3b0764", color: calendarTextColor }}
      >
        {children}
      </main>
    </div>
  );
}
