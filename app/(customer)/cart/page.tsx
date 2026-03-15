'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Store, Loader2, AlertCircle } from 'lucide-react';
import { checkoutOrders } from "@/app/actions/order";
import { getUserProfile } from '@/app/actions/user';
import toast from 'react-hot-toast';

const CartPage = () => {
    const { items, totalPrice, addItem, decreaseItem, removeItem, clearCart } = useCartStore();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [mounted, setMounted] = useState(false);

    const [hasAddress, setHasAddress] = useState<boolean | null>(null);

    useEffect(() => {
        setMounted(true);
        getUserProfile().then(user => {
            if (user?.address) setHasAddress(true);
            else setHasAddress(false);
        });
    }, []);

    if (!mounted || hasAddress === null) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse flex items-center gap-2"><Loader2 className="animate-spin" size={20}/> กำลังโหลดตะกร้า...</div></div>;

    const groupedItems = items.reduce((groups, item) => {
        const key = item.restaurantId;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
    }, {} as Record<string, typeof items>);

    const handleCheckout = () => {
        if (!hasAddress) {
            toast.error('กรุณาระบุที่อยู่จัดส่งก่อนสั่งอาหารครับ!');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        startTransition(async () => {
            const result = await checkoutOrders(items);
            if (result.success) {
                toast.success('สั่งอาหารสำเร็จ! ร้านกำลังเตรียมอาหารให้คุณ 🧑‍🍳'); // ใช้ Toast
                clearCart();
                router.push('/orders');
            } else {
                toast.error(result.message);
            }
        });
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="size-24 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text mb-2">ตะกร้าของคุณยังว่างเปล่า</h2>
                <p className="text-subtext dark:text-Dark_subtext mb-8 max-w-sm">
                    ดูเหมือนว่าคุณยังไม่ได้เลือกเมนูความอร่อยใส่ตะกร้าเลย ไปค้นหาร้านอาหารเด็ดๆ กันเถอะ!
                </p>
                <Link
                    href="/restaurants"
                    className="bg-primary dark:bg-Dark_primary text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                >
                    หาร้านอาหารเลย
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-extrabold text-Text dark:text-Dark_Text tracking-tight">
                        ตะกร้าสินค้า 🛒
                    </h1>
                    <p className="text-sm text-subtext dark:text-Dark_subtext mt-1">
                        ตรวจสอบรายการอาหารก่อนยืนยันการสั่งซื้อ
                    </p>
                </div>
                <button
                    onClick={clearCart}
                    className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                    ล้างตะกร้า
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                <div className="flex-1 space-y-6">
                    {Object.entries(groupedItems).map(([restaurantId, restaurantItems], index) => (
                        <div key={restaurantId} className="bg-BG_light dark:bg-Dark_BG_light rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                            <div className="bg-gray-50 dark:bg-zinc-900/50 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Store size={18} className="text-primary dark:text-Dark_primary" />
                                    <h3 className="font-bold text-Text dark:text-Dark_Text text-sm">
                                        {restaurantItems[0].restaurantName}
                                    </h3>
                                </div>
                                <span className="text-xs font-medium text-subtext dark:text-Dark_subtext bg-gray-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                    {restaurantItems.length} รายการ
                                </span>
                            </div>

                            <div className="p-4 space-y-4">
                                {restaurantItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="size-16 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0 overflow-hidden">
                                            <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between h-full py-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-sm text-Text dark:text-Dark_Text line-clamp-1">{item.name}</h4>
                                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="flex justify-between items-end mt-2">
                                                <span className="font-extrabold text-primary dark:text-Dark_primary text-sm">฿{item.price * item.quantity}</span>
                                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900 rounded-full px-1 py-1 border border-gray-200 dark:border-zinc-700">
                                                    <button onClick={() => decreaseItem(item.id)} className="size-6 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-Text dark:text-Dark_Text hover:bg-gray-100 shadow-sm transition-colors"><Minus size={12} strokeWidth={2.5} /></button>
                                                    <span className="text-xs font-bold text-Text dark:text-Dark_Text w-3 text-center">{item.quantity}</span>
                                                    <button onClick={() => addItem({ ...item })} className="size-6 rounded-full bg-primary dark:bg-Dark_primary flex items-center justify-center text-white hover:bg-orange-600 shadow-sm transition-colors"><Plus size={12} strokeWidth={2.5} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-80 h-fit bg-BG_light dark:bg-Dark_BG_light rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-5 sticky top-24">
                    <h3 className="text-lg font-bold text-Text dark:text-Dark_Text mb-4">สรุปคำสั่งซื้อ</h3>

                    <div className="space-y-3 text-sm text-subtext dark:text-Dark_subtext mb-4">
                        <div className="flex justify-between">
                            <span>ค่าอาหารรวม</span>
                            <span className="font-medium text-Text dark:text-Dark_Text">฿{totalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>ค่าจัดส่ง (จำลอง)</span>
                            <span className="font-medium text-Text dark:text-Dark_Text">฿15</span>
                        </div>
                        <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex justify-between items-center">
                            <span className="font-bold text-Text dark:text-Dark_Text">ยอดชำระสุทธิ</span>
                            <span className="text-xl font-extrabold text-primary dark:text-Dark_primary">
                                ฿{totalPrice + 15}
                            </span>
                        </div>
                    </div>

                    {!hasAddress && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-500 text-xs p-3 rounded-xl mb-4 flex gap-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>คุณต้องระบุ "ที่อยู่จัดส่ง" ที่เมนูด้านบนก่อน จึงจะสามารถชำระเงินได้</span>
                        </div>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={isPending || !hasAddress}
                        className="w-full flex items-center justify-center gap-2 bg-primary dark:bg-Dark_primary text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-colors shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>กำลังประมวลผล... <Loader2 size={18} className="animate-spin" /></>
                        ) : !hasAddress ? (
                            <>กรุณาระบุที่อยู่จัดส่ง</>
                        ) : (
                            <>ชำระเงินปลายทาง <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CartPage;