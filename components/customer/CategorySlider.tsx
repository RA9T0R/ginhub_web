'use client';

import React from 'react';
import Link from 'next/link';
import { RESTAURANT_CATEGORIES } from '@/lib/constants';

const CategorySlider = ({ activeCategory }: { activeCategory?: string }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">

            <Link
                href="/restaurants"
                className={`flex flex-col items-center gap-2 min-w-[80px] p-4 rounded-2xl transition-all border shrink-0
                    ${!activeCategory ? 'bg-primary border-primary text-white shadow-md' : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-primary/30'}`}
            >
                <div className="text-2xl">✨</div>
                <span className="text-sm font-bold">ทั้งหมด</span>
            </Link>

            {RESTAURANT_CATEGORIES.map((category) => (
                <Link
                    key={category.id}
                    href={`/restaurants?category=${encodeURIComponent(category.name)}`}
                    className={`flex flex-col items-center gap-2 min-w-[80px] p-4 rounded-2xl transition-all border shrink-0
                        ${activeCategory === category.name
                        ? 'bg-primary border-primary text-white shadow-md'
                        : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-primary/30'}`}
                >
                    <div className="text-2xl">{category.emoji}</div>
                    <span className="text-sm font-bold whitespace-nowrap">{category.name}</span>
                </Link>
            ))}

        </div>
    );
};

export default CategorySlider;