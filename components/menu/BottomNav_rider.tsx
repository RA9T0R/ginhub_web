'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {navItems} from "@/lib/constants";

const BottomNav_rider = () => {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-BG_light dark:bg-Dark_BG_light z-50">
            <div className="flex justify-around items-center px-2 h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                                isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                            }`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'transform scale-110 transition-transform' : ''} />
                            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav_rider;