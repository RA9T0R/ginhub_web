'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const BottomNav_customer = () => {
    const pathname = usePathname();
    const totalItems = useCartStore((state) => state.totalItems);

    const navItems = [
        { name: 'หน้าแรก', path: '/restaurants', icon: Home },
        { name: 'รายการโปรด', path: '/favorites', icon: Heart },
        { name: 'ออร์เดอร์', path: '/orders', icon: ReceiptText },
        { name: 'ตะกร้า', path: '/cart', icon: ShoppingCart },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-BG_light dark:bg-Dark_BG_light z-50 ">
            <div className="flex justify-between items-center px-6 h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center gap-1 min-w-[3rem] transition-colors ${
                                isActive ? 'text-primary dark:text-Dark_primary' : 'text-subtext dark:text-Dark_subtext hover:text-gray-600'
                            }`}
                        >
                            <div className="relative">
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={isActive ? 'transform scale-110 transition-transform' : ''}
                                />
                                {item.name === 'ตะกร้า' && totalItems > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center border-2 border-subtext dark:border-Dark_subtext">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default BottomNav_customer