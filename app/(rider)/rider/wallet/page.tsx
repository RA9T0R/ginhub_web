import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Wallet, ArrowDownToLine, ArrowUpRight, History } from 'lucide-react';

const prisma = new PrismaClient();

const RiderWalletPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'DELIVERY') redirect('/');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { riderProfile: true }
    });

    if (!user || !user.riderProfile) return redirect('/');

    const deliveredOrders = await prisma.order.findMany({
        where: { riderId: user.riderProfile.id, status: 'DELIVERED' },
        orderBy: { createdAt: 'desc' }
    });

    const totalBalance = deliveredOrders.reduce((sum, order) => sum + order.deliveryFee, 0);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">กระเป๋าเงินของฉัน</h1>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-gray-300 font-medium mb-2 flex items-center gap-2">
                        <Wallet size={18} /> ยอดเงินที่ถอนได้ (Balance)
                    </p>
                    <h2 className="text-5xl font-black">฿{totalBalance.toFixed(2)}</h2>
                </div>

                <div className="flex gap-4 mt-8 relative z-10">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <ArrowDownToLine size={20} /> ถอนเงิน
                    </button>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <ArrowUpRight size={20} /> เติมเครดิต
                    </button>
                </div>
                <div className="absolute -right-10 -top-10 size-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <History size={20} /> ประวัติรายได้ล่าสุด
                </h3>

                {deliveredOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">ยังไม่มีประวัติรายได้</p>
                ) : (
                    <div className="space-y-4">
                        {deliveredOrders.map((order) => (
                            <div key={order.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-zinc-950 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                        <Wallet size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">ค่ารอบจัดส่ง</p>
                                        <p className="text-xs text-gray-500">ออร์เดอร์ #{order.id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">+฿{order.deliveryFee.toFixed(2)}</p>
                                    <p className="text-[10px] text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiderWalletPage;