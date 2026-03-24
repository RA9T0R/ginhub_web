import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ClientOrderCard from "@/components/customer/ClientOrderCard";
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

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-6 mt-4">
            <div>
                <h1 className="text-2xl font-extrabold text-Text dark:text-Dark_Text">รายการสั่งซื้อของฉัน 🧾</h1>
            </div>

            <div className="flex border-b border-subtext dark:border-Dark_subtext">
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
                        return (
                            <ClientOrderCard
                                key={order.id}
                                order={order}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;