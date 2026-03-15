'use client';
import React, { useState } from 'react';
import { Plus, Check, Minus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface MenuProps {
    menu: {
        id: string;
        name: string;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        restaurantId: string;
        restaurantName: string;
    }
}

const MenuCard = ({ menu }: MenuProps) => {
    const [isAdded, setIsAdded] = useState(false);

    const cartItems = useCartStore((state) => state.items);
    const addItem = useCartStore((state) => state.addItem);
    const decreaseItem = useCartStore((state) => state.decreaseItem);

    const currentCartItem = cartItems.find(item => item.id === menu.id);
    const quantityInCart = currentCartItem ? currentCartItem.quantity : 0;

    const handleAddToCart = () => {
        // ให้โชว์ Effect เครื่องหมายถูกเฉพาะตอนที่กดเพิ่มครั้งแรก
        if (quantityInCart === 0) {
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 1000);
        }

        addItem({
            id: menu.id,
            name: menu.name,
            price: menu.price,
            imageUrl: menu.imageUrl,
            restaurantId: menu.restaurantId,
            restaurantName: menu.restaurantName
        });
    };

    return (
        <div className="flex bg-BG_light dark:bg-Dark_BG_light rounded-2xl p-3 gap-4 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">

            <div className="size-24 md:size-28 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0 overflow-hidden relative">
                <img
                    src={menu.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
                    alt={menu.name}
                    className={`w-full h-full object-cover ${!menu.isAvailable ? 'grayscale opacity-50' : ''}`}
                />
                {!menu.isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-white text-[10px] font-bold px-2 py-1 bg-red-500 rounded-md">หมด</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 justify-between py-1">
                <div>
                    <h3 className={`font-bold text-sm md:text-base ${!menu.isAvailable ? 'text-subtext dark:text-Dark_subtext' : 'text-Text dark:text-Dark_Text'}`}>
                        {menu.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-subtext dark:text-Dark_subtext mt-1 line-clamp-2">
                        ปรุงสุกใหม่ ร้อนๆ หอมอร่อย สูตรเฉพาะของทางร้าน
                    </p>
                </div>

                <div className="flex justify-between items-end">
                    <span className={`font-extrabold ${!menu.isAvailable ? 'text-subtext dark:text-Dark_subtext' : 'text-primary dark:text-Dark_primary'}`}>
                        ฿{menu.price}
                    </span>

                    {quantityInCart > 0 ? (
                        <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-500/10 rounded-full px-1 py-1 shadow-sm border border-orange-100 dark:border-orange-500/20">
                            <button
                                onClick={() => decreaseItem(menu.id)}
                                className="size-7 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-primary dark:text-Dark_primary hover:bg-gray-50 transition-colors"
                            >
                                <Minus size={14} strokeWidth={2.5} />
                            </button>

                            <span className="text-sm font-bold text-Text dark:text-Dark_Text w-3 text-center">
                                {quantityInCart}
                            </span>

                            <button
                                onClick={handleAddToCart}
                                className="size-7 rounded-full bg-primary dark:bg-Dark_primary flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
                            >
                                <Plus size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={!menu.isAvailable}
                            className={`size-8 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                                ${isAdded
                                ? 'bg-power dark:bg-Dark_power text-white scale-110'
                                : 'bg-orange-50 dark:bg-orange-500/10 text-primary dark:text-Dark_primary hover:bg-orange-100 dark:hover:bg-orange-500/20'
                            }`}
                        >
                            {isAdded ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5} />}
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default MenuCard;