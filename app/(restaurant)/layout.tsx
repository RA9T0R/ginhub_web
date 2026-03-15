import React from "react";
import ClientLayoutWrapper_restaurant from "@/components/helper/ClientLayoutWrapper_restaurant";

export default function RestaurantLayout({children}: { children: React.ReactNode }) {
    return (
        <ClientLayoutWrapper_restaurant>
            {children}
        </ClientLayoutWrapper_restaurant>
    );
}