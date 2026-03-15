import React from 'react';
import { PrismaClient } from '@prisma/client';
import { Receipt, Clock, CheckCircle2, ChefHat, XCircle } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const OrdersPage = async () => {
    const session = await getServerSession(authOptions);
    const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });

    if (!session || session.user.role !== 'CUSTOMER') {
        redirect('/');
    }

    const orders = await prisma.order.findMany({
        where: { customerId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: { menu: true }
            }
        }
    });

    const getStatusUI = (status: string) => {
        switch (status) {
            case 'PENDING': return { text: 'รอร้านรับออร์เดอร์', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
            case 'PREPARING': return { text: 'กำลังเตรียมอาหาร', color: 'bg-blue-100 text-blue-700', icon: ChefHat };
            case 'DELIVERED': return { text: 'จัดส่งสำเร็จ', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
            case 'CANCELLED': return { text: 'ยกเลิกแล้ว', color: 'bg-red-100 text-red-700', icon: XCircle };
            default: return { text: status, color: 'bg-gray-100 text-gray-700', icon: Receipt };
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-6">
            <div>
                <h1 className="text-2xl font-extrabold text-Text dark:text-Dark_Text">รายการสั่งซื้อของฉัน 🧾</h1>
                <p className="text-sm text-subtext dark:text-Dark_subtext mt-1">
                    คุณ {session.user.name} สามารถติดตามสถานะออร์เดอร์ได้ที่นี่
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-BG_light dark:bg-Dark_BG_light rounded-2xl border border-gray-100 dark:border-zinc-800">
                    <p className="text-subtext dark:text-Dark_subtext">ยังไม่มีประวัติการสั่งซื้อ</p>
                </div>
            ) : (
                <div className="space-y-4 pb-20 md:pb-6">
                    {orders.map((order) => {
                        const StatusUI = getStatusUI(order.status);
                        const Icon = StatusUI.icon;

                        return (
                            <div key={order.id} className="bg-BG_light dark:bg-Dark_BG_light rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4">

                                <div className="flex justify-between items-start border-b border-gray-100 dark:border-zinc-800 pb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-Text dark:text-Dark_Text">
                                            {order.restaurantName}
                                        </h3>
                                        <p className="text-xs text-subtext dark:text-Dark_subtext mt-1">
                                            รหัสคำสั่งซื้อ: {order.id.slice(-8).toUpperCase()}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${StatusUI.color}`}>
                                        <Icon size={14} />
                                        <span>{StatusUI.text}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-gray-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                                                    <img
                                                        src={item.menu.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80'}
                                                        alt={item.menu.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="text-subtext dark:text-Dark_subtext">
                                                    <span className="font-bold text-Text dark:text-Dark_Text mr-2">{item.quantity}x</span>
                                                    {item.menu.name}
                                                </span>
                                            </div>
                                            <span className="font-medium text-Text dark:text-Dark_Text">
                                                ฿{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-zinc-800">
                                    <span className="text-sm font-medium text-subtext dark:text-Dark_subtext">ยอดรวมทั้งหมด</span>
                                    <span className="text-lg font-extrabold text-primary dark:text-Dark_primary">
                                        ฿{order.totalAmount}
                                    </span>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;