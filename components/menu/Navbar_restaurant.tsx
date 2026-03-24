'use client';
import React, { useState, useEffect } from 'react';
import ThemeToggle from "@/components/ThemeToggle";
import { LogOut, Menu, User as UserIcon, ChevronDown, Store } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { getUserOnlineStatus, toggleUserOnlineStatus } from '@/app/actions/userStatus';
import toast from 'react-hot-toast';

interface NavbarBoardProps {
    onMobileMenuClick: () => void;
    userRole?: string;
}

const Navbar_restaurant = ({ onMobileMenuClick, userRole = "Restaurant" }: NavbarBoardProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(true); // ร้านค้าเริ่มต้นเป็น true
    const { data: session } = useSession();

    useEffect(() => {
        getUserOnlineStatus().then(status => setIsOnline(status));
    }, []);

    const handleToggleOnline = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);

        const result = await toggleUserOnlineStatus(newStatus);
        if (result.success) {
            toast.success(newStatus ? 'เปิดร้านแล้ว ลูกค้าสั่งอาหารได้เลย! 🧑‍🍳' : 'ปิดร้านชั่วคราวแล้วครับ 😴');
        } else {
            setIsOnline(!newStatus);
            toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่');
        }
    };

    return (
        <header className="h-16 w-full dark:border-zinc-800 flex justify-between items-center mb-2 rounded-t-lg z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuClick}
                    className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-lg"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden sm:flex items-center gap-2 bg-orange-100 dark:bg-orange-500/10 px-4 py-2.5 rounded-full">
                    <Store size={25} className="text-orange-600 dark:text-orange-500" />
                    <span className="text-md font-bold text-orange-600 dark:text-orange-500">{userRole}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700">
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                        {isOnline ? 'เปิดร้าน' : 'ปิดร้าน'}
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
                            peer-checked:bg-green-500 dark:peer-checked:bg-green-500
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                            after:bg-white after:border-gray-300 after:border after:rounded-full
                            after:h-3 after:w-3 after:transition-all
                            peer-checked:after:translate-x-4">
                        </div>
                    </label>
                </div>

                <ThemeToggle />

                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-Main_BG/5 hover:dark:bg-Dark_Main_BG/5 bg-Main_BG dark:bg-Dark_Main_BG border-BG_light dark:border-Dark_BG_light border-2 transition-colors cursor-pointer"
                    >
                        <div className="size-8 rounded-full bg-orange-500 flex items-center justify-center text-white overflow-hidden shadow-sm">
                            <UserIcon size={16} />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                {session?.user?.name || 'กำลังโหลด...'}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1">
                                {session?.user?.email}
                            </p>
                        </div>
                        <ChevronDown size={16} className={`hidden md:block text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 z-50 p-2 py-4">
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                >
                                    <LogOut size={16} />
                                    ออกจากระบบ
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
export default Navbar_restaurant;