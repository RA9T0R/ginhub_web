import React from 'react';
import { PrismaClient } from '@prisma/client';
import { Receipt, Clock, CheckCircle2, ChefHat, XCircle, Package, Bike } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

const OrdersPage = async ({ searchParams }: { searchParams: Promise<{ tab?: string }> }) => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CUSTOMER') redirect('/');

    const { tab } = await searchParams;
    const currentTab = tab || 'ongoing';

    const customerProfile = await prisma.customer.findUnique({
        where: { userId: session.user.id }
    });

    if (!customerProfile) {
        return <div className="p-8 text-center">ไม่พบข้อมูลลูกค้า</div>;
    }

    let statusFilter: string[] = [];
    if (currentTab === 'ongoing') {
        statusFilter = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP'];
    } else if (currentTab === 'completed') {
        statusFilter = ['DELIVERED'];
    } else if (currentTab === 'cancelled') {
        statusFilter = ['CANCELLED'];
    }

    const orders = await prisma.order.findMany({
        where: {
            customerId: customerProfile.id,
            status: { in: statusFilter as any }
        },
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { menu: true } } }
    });

    const getStatusUI = (status: string) => {
        switch (status) {
            case 'PENDING': return { text: 'รอร้านรับออร์เดอร์', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500', icon: Clock };
            case 'PREPARING': return { text: 'กำลังเตรียมอาหาร', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500', icon: ChefHat };
            case 'READY_FOR_PICKUP': return { text: 'รอไรเดอร์มารับ', color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-500', icon: Package };
            case 'PICKED_UP': return { text: 'ไรเดอร์กำลังมาส่ง', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-500', icon: Bike };
            case 'DELIVERED': return { text: 'จัดส่งสำเร็จ', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500', icon: CheckCircle2 };
            case 'CANCELLED': return { text: 'ยกเลิกแล้ว', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500', icon: XCircle };
            default: return { text: status, color: 'bg-gray-100 text-gray-700', icon: Receipt };
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-6 mt-4">
            <div>
                <h1 className="text-2xl font-extrabold text-Text dark:text-Dark_Text">รายการสั่งซื้อของฉัน 🧾</h1>
            </div>

            <div className="flex border-b border-gray-200 dark:border-zinc-800">
                <Link
                    href="/orders?tab=ongoing"
                    className={`flex-1 text-center py-3 text-sm font-bold border-b-2 transition-colors ${currentTab === 'ongoing' ? 'border-primary text-primary dark:border-Dark_primary dark:text-Dark_primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    กำลังดำเนินการ
                </Link>
                <Link
                    href="/orders?tab=completed"
                    className={`flex-1 text-center py-3 text-sm font-bold border-b-2 transition-colors ${currentTab === 'completed' ? 'border-primary text-primary dark:border-Dark_primary dark:text-Dark_primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    เสร็จสิ้น
                </Link>
                <Link
                    href="/orders?tab=cancelled"
                    className={`flex-1 text-center py-3 text-sm font-bold border-b-2 transition-colors ${currentTab === 'cancelled' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    ยกเลิก
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-BG_light dark:bg-Dark_BG_light rounded-2xl border border-gray-100 dark:border-zinc-800">
                    <div className="text-4xl mb-3">🍽️</div>
                    <p className="text-subtext dark:text-Dark_subtext font-medium">ยังไม่มีออร์เดอร์ในหมวดหมู่นี้</p>
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
                                        <h3 className="font-bold text-lg text-Text dark:text-Dark_Text line-clamp-1">
                                            {order.restaurantName}
                                        </h3>
                                        <p className="text-xs text-subtext dark:text-Dark_subtext mt-1">
                                            #{order.id.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold ${StatusUI.color} shrink-0`}>
                                        <Icon size={14} />
                                        <span>{StatusUI.text}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="size-12 rounded-lg bg-gray-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                                                    <img src={item.menu.imageUrl || 'https://via.placeholder.com/100'} alt={item.menu.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-subtext dark:text-Dark_subtext font-medium">
                                                    <span className="font-bold text-primary dark:text-Dark_primary mr-2">{item.quantity}x</span>
                                                    {item.menu.name}
                                                </span>
                                            </div>
                                            <span className="font-bold text-Text dark:text-Dark_Text">
                                                ฿{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-zinc-800">
                                    <span className="text-sm font-medium text-subtext dark:text-Dark_subtext">ยอดชำระสุทธิ (รวมค่าส่ง)</span>
                                    <span className="text-xl font-black text-primary dark:text-Dark_primary">
                                        ฿{order.totalAmount + order.deliveryFee}
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