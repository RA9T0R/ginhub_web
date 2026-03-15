'use client'

import React, { useState } from "react";
import Navbar_restaurant from "@/components/menu/Navbar_restaurant";
import Sidebar_restaurant from "@/components/menu/Sidebar_restaurant";
import MobileMenu_restaurant from "@/components/menu/MobileMenu_restaurant";

const ClientLayoutWrapper_restaurant = ({children}: { children: React.ReactNode; }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="h-screen w-full bg-BG_dark dark:bg-Dark_BG_dark p-2 flex items-center justify-center font-space-grotesk overflow-hidden">
            <div className="w-full h-full overflow-hidden flex flex-col relative">

                <MobileMenu_restaurant
                    isOpen={isMobileMenuOpen}
                    setIsOpen={setIsMobileMenuOpen}
                />

                <Navbar_restaurant
                    onMobileMenuClick={() => setIsMobileMenuOpen(true)}
                    userRole="Restaurant Manager"
                />

                <div className="flex flex-1 overflow-hidden relative border-2 border-BG_light dark:border-Dark_BG_light rounded-lg">
                    <Sidebar_restaurant
                        isCollapsed={isSidebarCollapsed}
                        setIsCollapsed={setIsSidebarCollapsed}
                    />

                    <main className="flex-1 overflow-y-auto bg-BG_dark dark:bg-Dark_BG_dark p-4 relative">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
export default ClientLayoutWrapper_restaurant