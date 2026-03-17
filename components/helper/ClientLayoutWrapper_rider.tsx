'use client';

import React, { useState, useEffect } from "react";
import Navbar_rider from "@/components/menu/Navbar_rider";
import BottomNav_rider from "@/components/menu/BottomNav_rider";

const ClientLayoutWrapper_rider = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 opacity-0" />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-space-grotesk">
            <Navbar_rider />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 pb-24 md:pb-8">
                {children}
            </main>
            <BottomNav_rider />
        </div>
    );
};

export default ClientLayoutWrapper_rider;