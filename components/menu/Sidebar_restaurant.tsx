'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { ArrowLeftFromLine, ArrowRightFromLine, LogOut } from 'lucide-react';
import { sidebarMenu } from '@/lib/constants';
import { signOut } from 'next-auth/react';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const Sidebar_restaurant = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <aside
            className={`
                hidden md:flex flex-col h-full bg-Main_BG dark:bg-Dark_Main_BG border-r border-BG_light dark:border-Dark_BG_light transition-all duration-300 relative z-20 rounded-l-lg
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}
        >
            <div className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-zinc-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
                        <Image
                            src="/decorate/GinHubRestaurant.png"
                            width={40}
                            height={40}
                            alt="Picture of the author"
                            className="rounded-full"
                        />
                        <h1 className="font-extrabold text-xl text-orange-600 tracking-tight whitespace-nowrap">
                            GINHUB
                        </h1>
                    </Link>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg shrink-0 cursor-pointer"
                >
                    {isCollapsed ? <ArrowRightFromLine size={20} /> : <ArrowLeftFromLine size={20} />}
                </button>
            </div>
            <nav className="flex-1 flex flex-col gap-2 px-3 py-6 overflow-y-auto">
                {sidebarMenu.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`
                                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500 font-semibold'
                                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 hover:dark:bg-zinc-900 hover:text-gray-900 dark:hover:text-white'
                            }
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                            {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })} // ✅ 2. ใส่ onClick
                    className={`flex items-center gap-4 px-3 py-3 w-full rounded-xl text-gray-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors cursor-pointer
                    ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium">ออกจากระบบ</span>}
                </button>
            </div>
        </aside>
    );
}
export default Sidebar_restaurant