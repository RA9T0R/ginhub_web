'use client';
import React, { useState, useEffect } from 'react';
import ThemeToggle from "@/components/ThemeToggle";
import { useSession } from 'next-auth/react';
import RiderLogoutButton from '@/components/rider/RiderLogoutButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {Home, Wallet, ClockFading, User} from 'lucide-react';
import { getUserOnlineStatus, toggleUserOnlineStatus } from '@/app/actions/userStatus';
import toast from 'react-hot-toast';

const Navbar_rider = () => {
    const { data: session } = useSession();
    const [isOnline, setIsOnline] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        getUserOnlineStatus().then(status => setIsOnline(status));
    }, []);

    const handleToggleOnline = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);

        const result = await toggleUserOnlineStatus(newStatus);
        if (result.success) {
            toast.success(newStatus ? 'ออนไลน์ พร้อมรับงาน! 🛵' : 'ออฟไลน์ พักผ่อนได้! 😴');
        } else {
            setIsOnline(!newStatus);
            toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่');
        }
    };

    const navItems = [
        { name: 'หน้าหลัก', path: '/rider', icon: Home },
        { name: 'รายได้', path: '/rider/wallet', icon: Wallet },
        { name: 'ประวัติ', path: '/rider/history', icon: ClockFading },
        { name: 'โปรไฟล์', path: '/rider/profile', icon: User },
    ];

    return (
        <header className="bg-BG_light dark:bg-Dark_BG_light sticky top-0 z-40 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/50 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg border border-secondary dark:border-Dark_secondary">
                            {session?.user?.name?.charAt(0) || 'R'}
                        </div>
                        <div className="hidden sm:block">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
                                {session?.user?.name}
                            </h2>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Rider Level 1</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 ml-6 border-l border-gray-200 dark:border-zinc-700 pl-6">
                        {navItems.map((item) => (
                            <Link key={item.path} href={item.path} className={`flex items-center gap-2 text-sm font-bold transition-colors ${pathname === item.path ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'}`}>
                                <item.icon size={18} /> {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700">
                        <span className={`text-xs font-bold ${isOnline ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500'}`}>
                            {isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isOnline}
                                onChange={handleToggleOnline}
                            />
                            <div className="w-8 h-4 bg-gray-300 dark:bg-zinc-600
                                peer-focus:outline-none rounded-full peer
                                peer-checked:bg-orange-500 dark:peer-checked:bg-orange-500
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                after:bg-white after:border-gray-300 after:border after:rounded-full
                                after:h-3 after:w-3 after:transition-all
                                peer-checked:after:translate-x-4">
                            </div>
                        </label>
                    </div>
                    <ThemeToggle />
                    <RiderLogoutButton />
                </div>

            </div>
        </header>
    );
};

export default Navbar_rider;