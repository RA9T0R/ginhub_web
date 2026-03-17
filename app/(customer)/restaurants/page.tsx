import React from 'react';
import { PrismaClient } from '@prisma/client';
import PromoBanner from '@/components/customer/PromoBanner';
import CategorySlider from '@/components/customer/CategorySlider';
import RestaurantCard from '@/components/customer/RestaurantCard';
import { getServerSession } from 'next-auth';
import { SearchX } from 'lucide-react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

const RestaurantsPage = async ({ searchParams }: { searchParams: Promise<{ category?: string, search?: string }> }) => {
    const { category, search } = await searchParams;

    const session = await getServerSession(authOptions);

    const whereCondition: any = {};

    if (category) {
        whereCondition.category = category;
    }

    if (search) {
        whereCondition.OR = [
            { name: { contains: search } },
            { description: { contains: search } },
            { menus: { some: { name: { contains: search } } } }
        ];
    }

    const restaurants = await prisma.restaurant.findMany({
        where: whereCondition,
        include: { menus: true }
    });

    let favIds: string[] = [];
    if (session && session.user.role === 'CUSTOMER') {
        const customer = await prisma.customer.findUnique({
            where: { userId: session.user.id },
            include: { favoriteRestaurants: { select: { id: true } } }
        });

        if (customer) {
            favIds = customer.favoriteRestaurants.map(r => r.id);
        }
    }

    return (
        <div className="space-y-8 pb-10">
            <PromoBanner />
            <CategorySlider activeCategory={category} />

            <div>
                <h3 className="text-xl font-bold mb-4 text-Text dark:text-Dark_Text">
                    {search ? `ผลการค้นหา "${search}" 🔍` : category ? `ร้านอาหารในหมวด "${category}"` : 'ร้านอาหารแนะนำ ✨'}
                </h3>

                {restaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.map((res) => (
                            <RestaurantCard
                                key={res.id}
                                restaurant={res}
                                isFavorited={favIds.includes(res.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-BG_light dark:bg-Dark_BG_light rounded-2xl border border-gray-100 dark:border-zinc-800 text-center px-4">
                        <div className="size-20 bg-gray-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <SearchX size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-Text dark:text-Dark_Text mb-2">อ๊ะ! ไม่พบร้านอาหารที่คุณตามหา</h3>
                        <p className="text-subtext dark:text-Dark_subtext text-sm max-w-sm">
                            ลองเปลี่ยนคำค้นหาใหม่ หรือเลือกดูร้านเด็ดๆ จากหมวดหมู่อื่นดูสิครับ
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantsPage;