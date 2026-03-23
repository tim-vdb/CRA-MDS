'use client';

import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import React, { useState } from "react";
import { ModeToggle } from "@/features/DarkMode/ModeToggle";
import DesktopNavbar from "@/features/Navbar/Public/Desktop/HeaderNavbar";
import MobileNavbar from "@/features/Navbar/Public/Mobile/HeaderNavbar";
import ProfileAccount from "@/components/ProfileAccount";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "../../utils/utils";
import { useMounted } from "../../utils/hooks/use-mounted";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const mounted = useMounted();
    const { state } = useSidebar();

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    const isSidebarExpanded = mounted && state === "expanded";

    return (
        <header
            className={cn(
                "fixed h-20 z-50 top-0 right-0 transition-all duration-200",
                mounted ? (isSidebarExpanded ? "md:left-64" : "left-0") : "md:left-64"
            )}
        >
            <div
                className="shadow-sm bg-white dark:bg-neutral-900 transition-all duration-200 ease-in-out h-20"
            >
                <div className="px-4 flex justify-between items-center h-full">
                    <SidebarTrigger className="mr-4 cursor-pointer" />
                    <Link href="/" className="shrink-0">
                        <Image
                            src="/images/cassetete.jpg"
                            alt="Boilerplate Logo"
                            width={100}
                            height={100}
                            className="w-auto transition-all duration-200 h-15"
                        />
                    </Link>

                    <DesktopNavbar />
                    <MobileNavbar setIsScrolled={setIsScrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-550"
                            onClick={toggleMenu}
                            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        >
                            {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                        </button>
                        <ProfileAccount />
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
