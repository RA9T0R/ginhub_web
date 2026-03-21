import React from 'react';
import { PrismaClient } from '@prisma/client';
import OrderCard from '@/components/restaurant/OrderCard';
import { ListOrdered, CheckCircle2 } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const DashboardOrdersPage = async ({ searchParams }: { searchParams: Promise<{ tab?: string }> }) => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'RESTAURANT') redirect('/');

    const { tab } = await searchParams;
    const currentTab = tab || 'ongoing';

    const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: session.user.id }
    });

    if (!restaurant) {
        return <div className="p-8 text-center text-red-500">ไม่พบข้อมูลร้านอาหารของคุณ</div>;
    }

    let statusFilter: string[] = [];
    if (currentTab === 'ongoing') {
        statusFilter = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP'];
    } else {
        statusFilter = ['PICKED_UP', 'DELIVERED', 'CANCELLED'];
    }

    const orders = await prisma.order.findMany({
        where: {
            restaurantId: restaurant.id,
            status: { in: statusFilter as any }
        },
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
        <div className="w-full flex flex-col gap-6 xl:max-w-9/10 mx-auto pb-12 animate-in fade-in">

            <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 p-3 rounded-2xl">
                    <ListOrdered size={28} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">จัดการออร์เดอร์</h1>
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">ร้าน: {restaurant.name}</p>
                </div>
            </div>

            <div className="flex gap-2 bg-gray-100 dark:bg-zinc-900/50 p-1 rounded-xl w-fit mb-4">
                <Link
                    href="/dashboard/orders?tab=ongoing"
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                        ${currentTab === 'ongoing' ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    <ListOrdered size={16} /> ต้องดำเนินการ
                </Link>
                <Link
                    href="/dashboard/orders?tab=history"
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                        ${currentTab === 'history' ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    <CheckCircle2 size={16} /> ประวัติย้อนหลัง
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
                    <div className="text-5xl mb-4 opacity-50">📋</div>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium">
                        {currentTab === 'ongoing' ? 'ยังไม่มีออร์เดอร์ที่ต้องดำเนินการในขณะนี้' : 'ยังไม่มีประวัติออร์เดอร์ย้อนหลัง'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className={currentTab === 'history' ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}>
                            <OrderCard order={order} />
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default DashboardOrdersPage;