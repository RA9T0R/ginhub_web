'use client';

import React, { useState } from 'react';
import { Star, Clock, ChefHat, Package, Bike, CheckCircle2, XCircle, Receipt, Ticket } from 'lucide-react';
import ReviewModal from '@/components/customer/ReviewModal';
import OrderTimeline from '@/components/customer/OrderTimeline';

const ClientOrderCard = ({ order }: { order: any }) => {
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const getStatusUI = (status: string) => {
        switch (status) {
            case 'PENDING': return { text: 'รอร้านรับออร์เดอร์', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500', icon: Clock };
            case 'PREPARING': return { text: 'กำลังเตรียมอาหาร', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500', icon: ChefHat };
            case 'READY_FOR_PICKUP': return { text: 'รอไรเดอร์มารับ', color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-500', icon: Package };
            case 'PICKED_UP': return { text: 'กำลังมาส่ง', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-500', icon: Bike };
            case 'DELIVERED': return { text: 'ส่งสำเร็จ', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500', icon: CheckCircle2 };
            case 'CANCELLED': return { text: 'ยกเลิกแล้ว', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500', icon: XCircle };
            default: return { text: status, color: 'bg-gray-100 text-gray-700', icon: Receipt };
        }
    };

    const StatusUI = getStatusUI(order.status);
    const StatusIcon = StatusUI.icon;

    const finalAmount = (order.totalAmount + order.deliveryFee) - (order.discountAmount || 0);

    return (
        <>
            <div className="bg-BG_light dark:bg-Dark_BG_light rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-4">

                <div className="flex justify-between items-start border-b border-gray-100 dark:border-zinc-800 pb-3">
                    <div>
                        <h3 className="font-bold text-lg text-Text dark:text-Dark_Text line-clamp-1">{order.restaurantName}</h3>
                        <p className="text-xs text-subtext dark:text-Dark_subtext mt-1">
                            ออร์เดอร์ #{order.id.slice(-8).toUpperCase()}
                        </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold ${StatusUI.color} shrink-0`}>
                        <StatusIcon size={14} />
                        <span>{StatusUI.text}</span>
                    </div>
                </div>

                {order.status !== 'CANCELLED' && (
                    <div className="pt-2 pb-4 border-b border-gray-100 dark:border-zinc-800">
                        <OrderTimeline status={order.status} />
                    </div>
                )}

                {order.status === 'CANCELLED' && (
                    <div className="pt-2 pb-4 border-b border-gray-100 dark:border-zinc-800">
                        <OrderTimeline status={order.status} />
                    </div>
                )}

                <div className="space-y-3 mt-2">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-lg bg-gray-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                                    <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.menu.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-subtext dark:text-Dark_subtext font-medium line-clamp-2">
                                    <span className="font-bold text-primary dark:text-Dark_primary mr-2">{item.quantity}x</span>
                                    {item.menu.name}
                                </span>
                            </div>
                            <span className="font-bold text-Text dark:text-Dark_Text shrink-0">฿{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>

                {/* สรุปยอดเงิน */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center text-sm text-subtext dark:text-Dark_subtext">
                        <span>ค่าอาหาร</span>
                        <span>฿{order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-subtext dark:text-Dark_subtext">
                        <span>ค่าจัดส่ง</span>
                        <span>฿{order.deliveryFee}</span>
                    </div>

                    {order.discountAmount > 0 && (
                        <div className="flex justify-between items-center text-sm font-bold text-secondary dark:text-Dark_secondary bg-secondary/10 dark:bg-Dark_secondary/10 px-3 py-1.5 rounded-lg">
                            <span className="flex items-center gap-1.5"><Ticket size={16}/> ส่วนลดคูปอง</span>
                            <span>-฿{order.discountAmount.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800">
                        <span className="text-sm font-bold text-Text dark:text-Dark_Text">ยอดชำระสุทธิ</span>
                        <span className="text-xl font-black text-primary dark:text-Dark_primary">
                            ฿{finalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>

                {order.status === 'DELIVERED' && !order.orderRating && (
                    <button
                        onClick={() => setIsReviewOpen(true)}
                        className="w-full mt-2 bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-transform shadow-md"
                    >
                        ให้คะแนนรีวิวร้านนี้ ⭐️
                    </button>
                )}

                {order.orderRating && (
                    <div className="w-full mt-2 bg-gray-50 dark:bg-zinc-800/50 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-500 border border-gray-100 dark:border-zinc-800">
                        คุณให้คะแนนร้านนี้แล้ว:
                        <div className="flex gap-0.5">
                            {[...Array(order.orderRating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                    </div>
                )}
            </div>

            <ReviewModal
                order={order}
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
            />
        </>
    );
}

export default ClientOrderCard;