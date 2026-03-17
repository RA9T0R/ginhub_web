'use client';
import React, { useState, useEffect } from 'react';
import ThemeToggle from "@/components/ThemeToggle";
import { MapPin, Search, User, ShoppingCart, ReceiptText, LogOut, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { getUserProfile } from '@/app/actions/user';
import ProfileModal from '@/components/customer/ProfileModal';

import { useRouter, useSearchParams } from 'next/navigation';

const Navbar_customer = ({ onLoginClick }: { onLoginClick: () => void }) => {
    const totalItems = useCartStore((state) => state.totalItems);
    const { data: session, status } = useSession();

    const [userAddress, setUserAddress] = useState('กรุณาล็อกอินเพื่อระบุที่อยู่');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');

    const fetchUserData = () => {
        if (status === 'authenticated') {
            getUserProfile().then((data) => {
                if (data?.address) {
                    setUserAddress(data.address);
                } else {
                    setUserAddress('คลิกเพื่อระบุที่อยู่จัดส่ง ✏️');
                }
            });
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push(`/restaurants`);
        }
    };

    return (
        <header className="bg-BG_light dark:bg-Dark_BG_light z-40 sticky top-0 border-b border-gray-100 dark:border-zinc-800">

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onProfileUpdated={fetchUserData}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/restaurants" className="hidden md:block text-2xl font-extrabold text-primary dark:text-Dark_primary tracking-tight">
                            GINHUB
                        </Link>

                        <div
                            onClick={() => status === 'authenticated' ? setIsProfileModalOpen(true) : onLoginClick()}
                            className="flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 p-1.5 rounded-lg transition-colors"
                            title="คลิกเพื่อแก้ไขข้อมูลจัดส่ง"
                        >
                            <span className="text-[10px] font-bold text-primary dark:text-Dark_primary uppercase flex items-center gap-1">
                                <MapPin size={12} /> จัดส่งที่
                            </span>
                            <span className="text-sm font-semibold text-subtext dark:text-Dark_subtext truncate max-w-[180px] sm:max-w-xs">
                                {userAddress}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-xl relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext dark:text-Dark_subtext" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="หิวอะไรดี? พิมพ์ชื่อร้าน หรือ เมนู ได้เลย"
                            className="w-full bg-Main_BG dark:bg-Dark_Main_BG text-sm text-subtext dark:text-Dark_subtext rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all border border-transparent dark:border-zinc-800"
                        />
                    </form>

                    <div className="flex items-center gap-2 md:gap-4">

                        <Link href="/favorites" className="hidden md:flex items-center gap-2 text-subtext dark:text-Dark_subtext hover:text-red-500 dark:hover:text-red-500 font-medium text-sm transition-colors">
                            <Heart size={20} /> <span className="hidden lg:inline">ร้านโปรด</span>
                        </Link>

                        <Link href="/orders" className="hidden md:flex items-center gap-2 text-subtext dark:text-Dark_subtext hover:text-primary dark:hover:text-Dark_primary font-medium text-sm transition-colors">
                            <ReceiptText size={20} /> <span className="hidden lg:inline">ออร์เดอร์</span>
                        </Link>

                        <Link href="/cart" className="hidden md:flex items-center gap-2 text-subtext dark:text-Dark_subtext hover:text-primary dark:hover:text-Dark_primary font-medium text-sm transition-colors relative mr-2">
                            <ShoppingCart size={20} /> <span className="hidden lg:inline">ตะกร้า</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <ThemeToggle />

                        <div className="flex items-center pl-2 ml-2 border-l border-gray-200 dark:border-zinc-700">
                            {status === 'loading' ? (
                                <div className="size-10 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
                            ) : session ? (
                                <div className="flex items-center gap-3">
                                    <span className="hidden md:block text-sm font-bold text-Text dark:text-Dark_Text">
                                        {session.user?.name}
                                    </span>
                                    <button onClick={() => signOut({ callbackUrl: '/' })} className="size-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors shrink-0" title="ออกจากระบบ">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={onLoginClick} className="size-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-primary dark:text-Dark_primary flex items-center justify-center hover:bg-orange-200 dark:hover:bg-orange-500/30 transition-colors shrink-0">
                                    <User size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="mt-3 sm:hidden relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext dark:text-Dark_subtext" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="หิวอะไรดี? ค้นหาร้านอาหารเลย"
                        className="w-full bg-Main_BG dark:bg-Dark_Main_BG text-sm text-subtext dark:text-Dark_subtext rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-transparent dark:border-zinc-800"
                    />
                </form>
            </div>
        </header>
    );
}

export default Navbar_customer;