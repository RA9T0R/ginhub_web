import React from 'react';
import { PrismaClient } from '@prisma/client';
import OrderCard from '@/components/restaurant/OrderCard';
import { ListOrdered } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const DashboardOrdersPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'RESTAURANT') {
        redirect('/');
    }

    const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: session.user.id }
    });

    if (!restaurant) {
        return <div className="p-8 text-center text-red-500">ไม่พบข้อมูลร้านอาหารของคุณ</div>;
    }

    const orders = await prisma.order.findMany({
        where: { restaurantId: restaurant.id },
        orderBy: [
            { status: 'asc' },
            { createdAt: 'desc' }
        ],
        include: {
            items: { include: { menu: true } },
            customer: true
        }
    });

    return (
        <div className="w-full flex flex-col gap-6 xl:max-w-9/10 mx-auto pb-12">

            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 p-2 rounded-xl">
                    <ListOrdered size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">จัดการออร์เดอร์</h1>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">ร้าน: {restaurant.name}</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800">
                    <p className="text-gray-500 dark:text-zinc-400">ยังไม่มีออร์เดอร์เข้ามาในขณะนี้</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}

        </div>
    );
};

export default DashboardOrdersPage;