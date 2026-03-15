import React from "react";
import ClientLayoutWrapper_customer from "@/components/helper/ClientLayoutWrapper_customer";

export default function CustomerLayout({children}: { children: React.ReactNode }) {
    return (
        <ClientLayoutWrapper_customer>
            {children}
        </ClientLayoutWrapper_customer>
    );
}