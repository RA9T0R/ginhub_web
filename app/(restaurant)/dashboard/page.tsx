import React from 'react';
import { PrismaClient } from '@prisma/client';
import { DollarSign, ShoppingBag, TrendingUp, Clock, AlertCircle, XCircle, Receipt } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import EditRestaurantModal from '@/components/restaurant/EditRestaurantModal';

const prisma = new PrismaClient();

const DashboardOverviewPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'RESTAURANT') redirect('/');

    const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: session.user.id }
    });

    if (!restaurant) {
        return <div className="p-8 text-center text-red-500">ไม่พบข้อมูลร้านอาหาร</div>;
    }

    const orders = await prisma.order.findMany({
        where: { restaurantId: restaurant.id },
        include: { items: { include: { menu: true } } },
        orderBy: { createdAt: 'desc' }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = orders.filter(order => new Date(order.createdAt) >= today);

    const todayRevenue = todaysOrders
        .filter(order => order.status === 'DELIVERED')
        .reduce((sum, order) => sum + order.totalAmount, 0);

    const todayTotalOrders = todaysOrders.length;

    const todayCanceled = todaysOrders.filter(order => order.status === 'CANCELLED').length;

    const activeOrders = orders.filter(order => order.status === 'PENDING' || order.status === 'PREPARING');

    const itemSales: Record<string, { name: string, count: number, revenue: number, imageUrl: string }> = {};
    orders.filter(order => order.status === 'DELIVERED').forEach(order => {
        order.items.forEach(item => {
            if (!itemSales[item.menuId]) {
                itemSales[item.menuId] = {
                    name: item.menu.name,
                    count: 0,
                    revenue: 0,
                    imageUrl: item.imageUrl || item.menu.imageUrl || 'https://via.placeholder.com/100'
                };
            }
            itemSales[item.menuId].count += item.quantity;
            itemSales[item.menuId].revenue += (item.price * item.quantity);
        });
    });

    const topItems = Object.values(itemSales)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return (
        <div className="w-full flex flex-col gap-6 xl:max-w-9/10 mx-auto pb-12">

            <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-400 p-6 md:p-8 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 flex-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold mb-2">สวัสดี, {restaurant.name} 👋</h1>
                    <p className="text-orange-50 text-sm md:text-base">วันนี้มีลูกค้าหิวโซรออาหารฝีมือคุณอยู่นะ!</p>
                </div>

                <div className="relative z-10">
                    <EditRestaurantModal restaurant={restaurant} />
                </div>

                <div className="absolute -right-10 -top-10 size-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute right-20 -bottom-10 size-32 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500 flex items-center justify-center shrink-0">
                        <DollarSign size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">ยอดขายวันนี้</p>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                            ฿{todayRevenue.toLocaleString()}
                        </h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-500 flex items-center justify-center shrink-0">
                        <Receipt size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">ออร์เดอร์วันนี้</p>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                            {todayTotalOrders}
                        </h2>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 flex items-center justify-center shrink-0">
                        <ShoppingBag size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">ค้างจัดส่ง</p>
                        <div className="flex items-center gap-2 mt-1">
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                {activeOrders.length}
                            </h2>
                            {activeOrders.length > 0 && (
                                <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                    <AlertCircle size={10} /> ด่วน
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 flex items-center justify-center shrink-0">
                        <XCircle size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">ยกเลิกวันนี้</p>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                            {todayCanceled}
                        </h2>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="text-blue-500" size={20} /> ออร์เดอร์ล่าสุด
                        </h3>
                        <Link href="/dashboard/orders" className="text-sm text-orange-500 hover:text-orange-600 font-medium hover:underline">
                            ดูทั้งหมด
                        </Link>
                    </div>

                    {activeOrders.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                            ไม่มีออร์เดอร์ค้าง เยี่ยมมาก! 🎉
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeOrders.slice(0, 3).map(order => (
                                <div key={order.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-zinc-950 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-zinc-800">
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                                            {order.items.length} รายการ • ฿{order.totalAmount}
                                        </p>
                                    </div>
                                    <Link
                                        href="/dashboard/orders"
                                        className="bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                                    >
                                        จัดการ
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                        <TrendingUp className="text-green-500" size={20} /> 5 อันดับเมนูขายดี 🔥
                    </h3>

                    {topItems.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                            ยังไม่มีข้อมูลยอดขาย
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <span className={`font-extrabold text-lg w-4 text-center ${index === 0 ? 'text-orange-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-300 dark:text-zinc-700'}`}>
                                        {index + 1}
                                    </span>
                                    <div className="size-12 rounded-lg bg-gray-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">ขายได้ {item.count} จาน</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-extrabold text-sm text-green-600 dark:text-green-500">
                                            +฿{item.revenue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverviewPage;