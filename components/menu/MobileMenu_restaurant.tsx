'use client';
import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { X, LogOut} from 'lucide-react';
import { sidebarMenu } from '@/lib/constants';
import { signOut } from 'next-auth/react';

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu_restaurant = ({ isOpen, setIsOpen }: MobileMenuProps) => {
    const pathname = usePathname();

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>

            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`absolute top-0 left-0 h-full w-72 bg-white dark:bg-zinc-950 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-orange-600">
                        <Image
                            src="/decorate/GinHubRestaurant.png"
                            width={40}
                            height={40}
                            alt="Picture of the author"
                            className="rounded-full"
                        />
                        <h1 className="font-extrabold text-xl tracking-tight">GINHUB</h1>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
                    {sidebarMenu.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center gap-4 px-4 py-3 rounded-xl transition-colors
                                    ${isActive
                                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500 font-semibold'
                                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 hover:dark:bg-zinc-900'
                                }
                                `}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800 mb-4">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })} // ✅ 2. ใส่ onClick
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-gray-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">ออกจากระบบ</span>
                    </button>
                </div>
            </aside>
        </div>
    );
}
export default MobileMenu_restaurant