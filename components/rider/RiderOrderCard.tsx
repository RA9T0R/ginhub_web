'use client';

import React, { useTransition } from 'react';
import { updateOrderStatus } from '@/app/actions/restaurant';
import { Store, User, MapPin, Phone, CheckCircle2, Bike, Loader2, Navigation, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { OrderStatus } from '@prisma/client';

interface RiderOrderCardProps {
    order: any;
}

const RiderOrderCard = ({ order }: RiderOrderCardProps) => {
    const [isPending, startTransition] = useTransition();

    const handleUpdateStatus = (newStatus: OrderStatus) => {
        startTransition(async () => {
            const result = await updateOrderStatus(order.id, newStatus);
            if (result.success) {
                if (newStatus === 'PICKED_UP') toast.success('รับอาหารแล้ว! ขับขี่ปลอดภัยนะครับ 🛵');
                if (newStatus === 'DELIVERED') toast.success('จัดส่งสำเร็จ! รับรายได้ไปเลย 💸');
            } else {
                toast.error(result.message || 'เกิดข้อผิดพลาด');
            }
        });
    };

    const isActive = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP'].includes(order.status);

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-3xl p-5 border shadow-sm flex flex-col gap-4 overflow-hidden relative
            ${isActive ? 'border-blue-200 dark:border-blue-900/50' : 'border-gray-200 dark:border-zinc-800 opacity-70'}
        `}>

            {order.status === 'PREPARING' && <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-400 animate-pulse"></div>}
            {order.status === 'READY_FOR_PICKUP' && <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500 animate-pulse"></div>}
            {order.status === 'PICKED_UP' && <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500"></div>}
            {order.status === 'DELIVERED' && <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-500"></div>}

            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">#{order.id.slice(-6).toUpperCase()}</span>
                <span className="font-extrabold text-xl text-Text dark:text-white">฿{order.totalAmount}</span>
            </div>

            <div className="space-y-4 relative">
                <div className="absolute left-[15px] top-[40px] bottom-[40px] w-0.5 border-l-2 border-dashed border-gray-200 dark:border-zinc-700"></div>

                <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-zinc-900">
                        <Store size={14} suppressHydrationWarning />
                    </div>
                    <div className="flex-1 pb-4">
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">รับอาหารที่</p>
                        <h3 className="font-bold text-base text-Text dark:text-white leading-tight">{order.restaurantName}</h3>
                        <p className="text-xs text-subtext dark:text-zinc-400 mt-1">{order.items.length} รายการ (฿{order.totalAmount})</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-zinc-900">
                        <MapPin size={14} suppressHydrationWarning/>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">จัดส่งให้</p>
                        <h3 className="font-bold text-base text-Text dark:text-white leading-tight">{order.customer.name}</h3>
                        <p className="text-sm text-subtext dark:text-zinc-400 mt-1 leading-snug">{order.customer.address || 'ไม่ได้ระบุที่อยู่'}</p>

                        {isActive && order.customer.phone && (
                            <a href={`tel:${order.customer.phone}`} className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm font-medium text-Text dark:text-white">
                                <Phone size={14} className="text-green-500"/> โทรหาลูกค้า
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {isActive && (
                <div className="mt-2 pt-4 border-t border-gray-100 dark:border-zinc-800">

                    {['PENDING', 'PREPARING', 'READY_FOR_PICKUP'].includes(order.status) && (
                        <button
                            onClick={() => handleUpdateStatus('PICKED_UP')}
                            disabled={isPending || order.status !== 'READY_FOR_PICKUP'} // ❌ กดไม่ได้ถ้าร้านยังทำไม่เสร็จ
                            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm
                                ${order.status === 'READY_FOR_PICKUP'
                                ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed'}`}
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : (
                                order.status === 'READY_FOR_PICKUP' ? <Package size={20} /> : <Store size={20} />
                            )}
                            {/* เปลี่ยนข้อความบนปุ่มตามสถานะของร้าน */}
                            {order.status === 'PENDING' && 'รอร้านรับออร์เดอร์...'}
                            {order.status === 'PREPARING' && 'ร้านกำลังเตรียมอาหาร...'}
                            {order.status === 'READY_FOR_PICKUP' && 'กดรับอาหาร'}
                        </button>
                    )}

                    {order.status === 'PICKED_UP' && (
                        <button
                            onClick={() => handleUpdateStatus('DELIVERED')}
                            disabled={isPending}
                            className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm
                                bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : <Navigation size={20} />}
                            จัดส่งถึงมือลูกค้าสำเร็จ
                        </button>
                    )}
                </div>
            )}

            {order.status === 'DELIVERED' && (
                <div className="bg-green-50 dark:bg-green-500/10 text-green-600 font-bold py-2 rounded-xl text-center text-sm flex items-center justify-center gap-2 mt-2">
                    <CheckCircle2 size={16} /> จัดส่งสำเร็จแล้ว
                </div>
            )}
        </div>
    );
}

export default RiderOrderCard