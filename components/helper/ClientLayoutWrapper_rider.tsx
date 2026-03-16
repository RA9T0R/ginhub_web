'use client';

import React from "react";
import Navbar_rider from "@/components/menu/Navbar_rider";
import BottomNav_rider from "@/components/menu/BottomNav_rider";

const ClientLayoutWrapper_rider = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-Main_BG dark:bg-Dark_Main_BG font-space-grotesk flex flex-col relative">
            <Navbar_rider />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
                {children}
            </main>
            <BottomNav_rider />

        </div>
    );
};

export default ClientLayoutWrapper_rider;