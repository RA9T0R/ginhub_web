'use client';

import React, { useState, useTransition } from 'react';
import { Star, Store, Bike, X, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitOrderReview } from '@/app/actions/review';

interface ReviewModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
}

const ReviewModal = ({ order, isOpen, onClose }: ReviewModalProps) => {
    const [foodRating, setFoodRating] = useState(5);
    const [driverRating, setDriverRating] = useState(5);
    const [isPending, startTransition] = useTransition();

    if (!isOpen) return null;

    const handleSubmit = () => {
        startTransition(async () => {
            const result = await submitOrderReview(
                order.id,
                order.restaurantId,
                order.riderId,
                foodRating,
                driverRating
            );

            if (result.success) {
                toast.success(result.message);
                onClose();
            } else {
                toast.error(result.message);
            }
        });
    };

    const renderStars = (rating: number, setRating: (val: number) => void) => (
        <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none hover:scale-110 transition-transform"
                >
                    <Star
                        size={32}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-zinc-700'}
                    />
                </button>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-sm w-full relative shadow-2xl zoom-in-95 animate-in">

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <div className="size-16 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ได้รับอาหารแล้ว!</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ช่วยให้คะแนนเพื่อเป็นกำลังใจให้ร้านค้าและไรเดอร์หน่อยนะครับ
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold">
                            <Store size={18} className="text-orange-500" /> อาหารจากร้าน {order.restaurantName}
                        </div>
                        <div className="flex justify-center mt-2">
                            {renderStars(foodRating, setFoodRating)}
                        </div>
                    </div>

                    {order.riderId && (
                        <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-bold">
                                <Bike size={18} className="text-blue-500" /> การจัดส่งโดยไรเดอร์
                            </div>
                            <div className="flex justify-center mt-2">
                                {renderStars(driverRating, setDriverRating)}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="w-full bg-primary dark:bg-Dark_primary text-white font-bold py-3.5 rounded-xl mt-8 transition-colors hover:bg-orange-600 flex items-center justify-center gap-2"
                >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : 'ส่งคะแนนรีวิว'}
                </button>

            </div>
        </div>
    );
}

export default ReviewModal