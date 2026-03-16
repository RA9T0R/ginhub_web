import React from "react";
import ClientLayoutWrapper_rider from "@/components/helper/ClientLayoutWrapper_rider";

export default function RiderLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClientLayoutWrapper_rider>
            {children}
        </ClientLayoutWrapper_rider>
    );
}