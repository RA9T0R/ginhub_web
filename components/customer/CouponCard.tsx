'use client';

import React from 'react';
import { Gift, Percent, DollarSign, XCircle, Clock } from 'lucide-react';
import { DiscountType } from '@prisma/client';

interface CouponCardProps {
    coupon: {
        code: string;
        description: string;
        discountType: DiscountType;
        discountValue: number;
        expiresAt: Date | null;
        isUsed: Boolean;
    };
}

const CouponCard = ({ coupon }: CouponCardProps) => {
    const isPercentage = coupon.discountType === 'PERCENTAGE';
    const primaryColor = isPercentage
        ? 'from-red-500 to-rose-600'
        : 'from-blue-500 to-sky-600';
    const Icon = isPercentage ? Percent : DollarSign;

    const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
    const expiryDate = coupon.expiresAt
        ? new Date(coupon.expiresAt).toLocaleDateString('th-TH', {
            day: '2-digit', month: 'short', year: '2-digit'
        })
        : 'ไม่มีวันหมดอายุ';

    return (
        <div className={`relative w-full aspect-[21/9] rounded-2xl p-1 shadow-inner overflow-hidden flex items-stretch border border-gray-100 dark:border-zinc-800 animate-in fade-in ${coupon.isUsed || isExpired ? 'opacity-60 grayscale' : ''}`}>

            <div className={`w-[30%] bg-gradient-to-br ${primaryColor} rounded-xl flex flex-col items-center justify-center text-white shrink-0`}>
                <div className="bg-white/20 p-2.5 rounded-full mb-1">
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-wider">{isPercentage ? 'อาหาร' : 'ค่าส่ง'}</p>
            </div>

            <div className="flex-1 bg-white dark:bg-zinc-950 px-4 py-2 flex flex-col justify-between ml-1 rounded-xl">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="font-extrabold text-Text dark:text-Dark_Text text-[16px] leading-snug line-clamp-2">{coupon.description}</h4>
                        <div className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-Text dark:text-Dark_Text font-black text-[10px] tracking-tight shrink-0">
                            {coupon.code}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-subtext dark:text-Dark_subtext">
                        <Clock size={12} />
                        <p className="text-[11px] font-medium">หมดอายุ {expiryDate}</p>
                    </div>
                </div>

                {/* สถานะ */}
                {coupon.isUsed && (
                    <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">ใช้แล้ว</div>
                )}
                {isExpired && !coupon.isUsed && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5"><XCircle size={10}/> หมดอายุ</div>
                )}
            </div>

            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 size-4 bg-BG_dark dark:bg-Dark_BG_dark rounded-full border border-gray-100 dark:border-zinc-800"></div>
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 size-4 bg-BG_dark dark:bg-Dark_BG_dark rounded-full border border-gray-100 dark:border-zinc-800"></div>
        </div>
    );
}

export default CouponCard