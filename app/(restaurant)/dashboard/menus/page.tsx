import React from 'react';
import { PrismaClient } from '@prisma/client';
import { Utensils } from 'lucide-react';
import MenuManager from '@/components/restaurant/MenuManager';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const DashboardMenusPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'RESTAURANT') {
        redirect('/');
    }

    const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: session.user.id }
    });

    if (!restaurant) {
        return <div className="p-8 text-center text-red-500">ไม่พบข้อมูลร้านอาหาร</div>;
    }

    const menus = await prisma.menu.findMany({
        where: { restaurantId: restaurant.id },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="w-full flex flex-col gap-6 xl:max-w-9/10 mx-auto pb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 p-2 rounded-xl">
                    <Utensils size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">จัดการเมนูอาหาร</h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">ร้าน: {restaurant.name}</p>
                </div>
            </div>

            <MenuManager
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
                menus={menus}
            />
        </div>
    );
};

export default DashboardMenusPage;