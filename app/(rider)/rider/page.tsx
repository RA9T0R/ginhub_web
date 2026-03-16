import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import RiderOrderCard from '@/components/rider/RiderOrderCard';
import { Bike, Wallet, CheckCircle2 } from 'lucide-react';

const prisma = new PrismaClient();

const RiderDashboardPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'DELIVERY') redirect('/');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { riderProfile: true }
    });

    if (!user || !user.riderProfile) return redirect('/');

    const orders = await prisma.order.findMany({
        where: { riderId: user.riderProfile.id },
        include: {
            customer: true, // จะดึงข้อมูลจากตาราง Customer
            items: { include: { menu: true } }
        },
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }]
    });

    const activeOrders = orders.filter(o => ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP'].includes(o.status));
    const historyOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));

    const totalEarnings = historyOrders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, order) => sum + order.deliveryFee, 0);

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-orange-200 text-sm md:text-base font-medium mb-1">รายได้วันนี้</p>
                    <div className="flex items-end justify-between mt-2">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">฿{totalEarnings.toFixed(2)}</h2>
                        <Wallet size={40} className="text-orange-300 opacity-80" />
                    </div>
                </div>
                <div className="absolute -right-10 -top-10 size-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute right-20 -bottom-10 size-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-Text dark:text-Dark_Text text-lg md:text-xl flex items-center gap-2">
                            <Bike className="text-orange-500" size={24}/> งานปัจจุบัน
                        </h3>
                        <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
                            {activeOrders.length} งาน
                        </span>
                    </div>

                    {activeOrders.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-zinc-800 rounded-3xl p-10 text-center text-subtext dark:text-Dark_subtext shadow-sm">
                            <div className="text-4xl mb-4">☕</div>
                            <p className="font-medium">ยังไม่มีงานเข้าในขณะนี้</p>
                            <p className="text-xs mt-2 opacity-70">แวะพักผ่อนหรือหาอะไรดื่มรอได้เลย</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeOrders.map(order => <RiderOrderCard key={order.id} order={order} />)}
                        </div>
                    )}
                </section>

                <section>
                    <h3 className="font-bold text-Text dark:text-Dark_Text text-lg md:text-xl flex items-center gap-2 mb-4">
                        <CheckCircle2 className="text-green-500" size={24}/> ประวัติงานวันนี้
                    </h3>

                    {historyOrders.length === 0 ? (
                        <div className="bg-transparent border border-dashed border-gray-300 dark:border-zinc-800 rounded-3xl p-10 text-center text-subtext dark:text-Dark_subtext">
                            <p className="font-medium text-sm">ยังไม่มีประวัติการส่งอาหาร</p>
                        </div>
                    ) : (
                        <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                            {historyOrders.map(order => <RiderOrderCard key={order.id} order={order} />)}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default RiderDashboardPage;