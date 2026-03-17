import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';
import RestaurantCard from '@/components/customer/RestaurantCard';

const prisma = new PrismaClient();

const FavoritesPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CUSTOMER') redirect('/');

    const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id },
        include: {
            favoriteRestaurants: true
        }
    });

    if (!customer) {
        return <div className="p-8 text-center">ไม่พบข้อมูลลูกค้า</div>;
    }

    const favorites = customer.favoriteRestaurants;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-6 mt-4">

            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-zinc-800 pb-4">
                <Heart size={32} className="text-red-500 fill-red-500" />
                <div>
                    <h1 className="text-2xl font-extrabold text-Text dark:text-Dark_Text">ร้านอาหารโปรดของฉัน</h1>
                    <p className="text-sm text-subtext dark:text-Dark_subtext mt-1">
                        เลือกร้านที่คุณถูกใจไว้สั่งทานอีกครั้ง
                    </p>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-BG_light dark:bg-Dark_BG_light rounded-2xl border border-gray-100 dark:border-zinc-800">
                    <div className="text-5xl mb-4 text-gray-300">💔</div>
                    <p className="text-lg font-bold text-Text dark:text-Dark_Text mb-1">คุณยังไม่มีร้านอาหารโปรด</p>
                    <p className="text-sm text-subtext dark:text-Dark_subtext">
                        ลองค้นหาร้านอร่อยแล้วกดหัวใจเก็บไว้ดูสิ!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {favorites.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            isFavorited={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;