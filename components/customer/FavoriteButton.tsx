'use client';

import React, { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavoriteRestaurant } from '@/app/actions/favorite';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
    restaurantId: string;
    initialIsFavorited: boolean;
}

const FavoriteButton = ({ restaurantId, initialIsFavorited }: FavoriteButtonProps) => {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsFavorited(!isFavorited);

        startTransition(async () => {
            const result = await toggleFavoriteRestaurant(restaurantId);
            if (!result.success) {
                setIsFavorited(isFavorited);
                toast.error(result.message || 'เกิดข้อผิดพลาด');
            } else {
                if (result.isFavorited) {
                    toast.success('บันทึกเป็นร้านโปรดแล้ว ❤️');
                } else {
                    toast('ลบออกจากร้านโปรดแล้ว 🤍', { icon: '🗑️' });
                }
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className="p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm hover:scale-110 transition-transform shadow-sm border border-gray-100 dark:border-zinc-800"
            aria-label="Favorite"
        >
            <Heart
                size={20}
                className={`transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-300'}`}
            />
        </button>
    );
}

export default  FavoriteButton