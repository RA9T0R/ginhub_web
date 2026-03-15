import React from 'react';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, Clock, MapPin, ChevronLeft, Info } from 'lucide-react';
import MenuCard from '@/components/customer/MenuCard';

const prisma = new PrismaClient();

const RestaurantDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const restaurant = await prisma.restaurant.findUnique({
        where: { id: id },
        include: {
            menus: true
        }
    });

    if (!restaurant) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 pb-6">
            <div className="relative h-48 md:h-64 w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
                <img
                    src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&q=80'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* ปุ่มย้อนกลับ */}
                <Link href="/restaurants" className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition-colors">
                    <ChevronLeft size={24} />
                </Link>
            </div>

            <div className="relative -mt-16 md:-mt-20 mx-4 md:mx-8 bg-BG_light dark:bg-Dark_BG_light rounded-2xl p-5 md:p-6 shadow-md border border-gray-100 dark:border-zinc-800 z-10">
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-Text dark:text-Dark_Text">
                        {restaurant.name}
                    </h1>
                    <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-xl">
                        <Star size={18} className="text-secondary dark:text-Dark_secondary fill-secondary dark:fill-Dark_secondary mb-0.5" />
                        <span className="text-sm font-bold text-primary dark:text-Dark_primary">4.8</span>
                    </div>
                </div>

                <p className="text-sm text-subtext dark:text-Dark_subtext mt-2">
                    {restaurant.description || 'ร้านอาหารยอดฮิต รสชาติถูกปาก ราคาถูกใจ ส่งไวถึงบ้านคุณ'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-subtext dark:text-Dark_subtext font-medium mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <span className="flex items-center gap-1.5"><MapPin size={16} /> 2.5 กม.</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} /> 15-20 นาที</span>
                    <span className="flex items-center gap-1.5"><Info size={16} /> ค่าส่ง 15 บาท</span>
                </div>
            </div>

            <div className="px-2 md:px-0 mt-4">
                <h2 className="text-xl font-bold text-Text dark:text-Dark_Text mb-4 pl-2">
                    เมนูยอดฮิต 🔥
                </h2>

                {restaurant.menus.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {restaurant.menus.map((menu) => (
                            <MenuCard key={menu.id} menu={menu} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
                        <p className="text-subtext dark:text-Dark_subtext">ยังไม่มีเมนูอาหารในร้านนี้</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default RestaurantDetailPage;