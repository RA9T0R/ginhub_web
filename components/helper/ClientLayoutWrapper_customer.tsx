'use client'
import React, { useState } from "react";
import Navbar_customer from "@/components/menu/Navbar_customer";
import BottomNav_customer from "@/components/menu/BottomNav_customer";
import AuthModal from "@/components/menu/AuthModal";

const ClientLayoutWrapper_customer = ({ children }: { children: React.ReactNode; }) => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <div className="min-h-screen bg-Main_BG dark:bg-Dark_Main_BG font-space-grotesk flex flex-col relative">

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} role={"CUSTOMER"} />

            <Navbar_customer onLoginClick={() => setIsAuthOpen(true)} />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
                {children}
            </main>

            <BottomNav_customer />
        </div>
    );
}
export default ClientLayoutWrapper_customer