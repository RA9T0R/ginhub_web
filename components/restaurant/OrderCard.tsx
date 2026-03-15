'use client';

import React, { useTransition } from 'react';
import { updateOrderStatus } from '@/app/actions/restaurant';
import { Clock, ChefHat, CheckCircle2, XCircle, Loader2, MapPin, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderCardProps {
    order: any;
}

const OrderCard = ({ order }: OrderCardProps) => {
    const [isPending, startTransition] = useTransition();

    const handleUpdateStatus = (newStatus: string) => {
        startTransition(async () => {
            const result = await updateOrderStatus(order.id, newStatus);

            if (result.success) {
                if (newStatus === 'PREPARING') toast.success('รับออร์เดอร์แล้ว! ลุยเลย 🧑‍🍳');
                if (newStatus === 'DELIVERED') toast.success('จัดส่งสำเร็จ ยอดเยี่ยมมาก! 🛵');
                if (newStatus === 'CANCELLED') toast.error('ยกเลิกออร์เดอร์แล้ว ❌');
            } else {
                toast.error(result.message || 'เกิดข้อผิดพลาด');
            }
        });
    };

    const statusConfig = {
        PENDING: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-500', icon: Clock, label: 'รอรับออร์เดอร์' },
        PREPARING: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-500', icon: ChefHat, label: 'กำลังทำอาหาร' },
        DELIVERED: { color: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-500', icon: CheckCircle2, label: 'จัดส่งสำเร็จ' },
        CANCELLED: { color: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-500', icon: XCircle, label: 'ยกเลิกแล้ว' },
    };

    const currentStatus = statusConfig[order.status as keyof typeof statusConfig];
    const StatusIcon = currentStatus.icon;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 md:p-6 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-6 justify-between transition-all hover:shadow-md">
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between md:justify-start gap-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                        ออร์เดอร์ <span className="text-orange-500">#{order.id.slice(-6).toUpperCase()}</span>
                    </h3>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${currentStatus.color}`}>
                        {isPending ? <Loader2 size={14} className="animate-spin" /> : <StatusIcon size={14} />}
                        {currentStatus.label}
                    </span>
                </div>

                <div className="bg-orange-50 dark:bg-orange-500/5 p-4 rounded-xl border border-orange-100 dark:border-orange-500/10 space-y-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User size={16} className="text-orange-500" />
                        {order.customer.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 flex items-center gap-2">
                        <Phone size={16} className="text-orange-500" />
                        {order.customer.phone || <span className="italic text-gray-400">ไม่ได้ระบุเบอร์โทร</span>}
                    </p>
                    <div className="text-sm text-gray-600 dark:text-zinc-400 flex items-start gap-2">
                        <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                            {order.customer.address || <span className="italic text-gray-400">ลูกค้าไม่ได้ระบุที่อยู่จัดส่ง</span>}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">รายการอาหาร</p>
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 items-center p-2 hover:bg-gray-50 dark:hover:bg-zinc-950 rounded-xl transition-colors">
                            {/* ขยายขนาดรูปจาก size-8 เป็น size-14 (56x56px) */}
                            <div className="size-14 rounded-lg bg-gray-200 dark:bg-zinc-800 overflow-hidden shrink-0 shadow-sm border border-gray-100 dark:border-zinc-700">
                                <img
                                    src={item.imageUrl || item.menu.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={item.menu.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                                    <span className="text-orange-600 dark:text-orange-500 mr-2">{item.quantity}x</span>
                                    {item.menu.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                                    ฿{item.price} / จาน
                                </p>
                            </div>

                            <div className="text-right font-extrabold text-gray-900 dark:text-white">
                                ฿{item.price * item.quantity}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-row md:flex-col items-end justify-between md:justify-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-zinc-800 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
                <div className="text-left md:text-right w-full md:w-auto mb-auto">
                    <p className="text-xs font-medium text-gray-500 dark:text-zinc-500 mb-1">ยอดรวมทั้งหมด</p>
                    <p className="text-2xl font-black text-orange-600 dark:text-orange-500">฿{order.totalAmount}</p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                    {order.status === 'PENDING' && (
                        <>
                            <button
                                onClick={() => handleUpdateStatus('PREPARING')}
                                disabled={isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm shadow-sm disabled:opacity-50"
                            >
                                รับออร์เดอร์
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('CANCELLED')}
                                disabled={isPending}
                                className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 font-bold py-3 px-4 rounded-xl transition-colors text-sm disabled:opacity-50"
                            >
                                ปฏิเสธ
                            </button>
                        </>
                    )}

                    {order.status === 'PREPARING' && (
                        <button
                            onClick={() => handleUpdateStatus('DELIVERED')}
                            disabled={isPending}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            <CheckCircle2 size={18} /> ส่งอาหารแล้ว
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;