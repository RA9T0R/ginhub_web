import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import RiderOrderCard from '@/components/rider/RiderOrderCard';
import { ClockFading } from 'lucide-react';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const RiderHistoryPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'DELIVERY') redirect('/');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { riderProfile: true }
    });

    if (!user || !user.riderProfile) return redirect('/');

    const historyOrders = await prisma.order.findMany({
        where: {
            riderId: user.riderProfile.id,
            status: { in: ['DELIVERED', 'CANCELLED'] }
        },
        include: { customer: true, items: { include: { menu: true } } },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ClockFading className="text-orange-500" /> ประวัติงานทั้งหมด
            </h1>

            {historyOrders.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-zinc-800 rounded-3xl p-10 text-center text-gray-500">
                    <p>คุณยังไม่มีประวัติการจัดส่งอาหาร</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyOrders.map(order => (
                        <RiderOrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderHistoryPage;