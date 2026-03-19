'use client';

import React from 'react';
import { Percent, DollarSign, XCircle, Clock, Tag } from 'lucide-react';
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
        <div className={`relative w-full h-[120px] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex overflow-hidden bg-white dark:bg-zinc-950 transition-all hover:shadow-md ${coupon.isUsed || isExpired ? 'opacity-50 grayscale' : ''}`}>

            <div className={`relative w-[100px] shrink-0 bg-gradient-to-br ${primaryColor} flex flex-col items-center justify-center text-white z-10`}>
                <div className="bg-white/20 p-2.5 rounded-full mb-1">
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-wider shadow-sm">
                    {isPercentage ? 'ส่วนลด' : 'ค่าจัดส่ง'}
                </p>
                <div className="absolute right-0 top-0 bottom-0 w-0 border-r-2 border-dashed border-white/40"></div>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-center relative z-10">
                <div className="pr-16">
                    <h4 className="font-extrabold text-Text dark:text-Dark_Text text-[16px] md:text-[18px] leading-snug line-clamp-2">
                        {coupon.description}
                    </h4>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-subtext dark:text-Dark_subtext bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded-md">
                        <Clock size={12} className="text-primary dark:text-Dark_primary" />
                        <p className="text-[11px] font-medium">หมดอายุ {expiryDate}</p>
                    </div>

                    <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-Text dark:text-Dark_Text font-black text-[11px] tracking-widest uppercase border border-gray-200 dark:border-zinc-700 flex items-center gap-1.5 shadow-sm">
                        <Tag size={12} className="text-secondary dark:text-Dark_secondary" />
                        {coupon.code}
                    </div>
                </div>

                {coupon.isUsed && (
                    <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide">ใช้แล้ว</div>
                )}
                {isExpired && !coupon.isUsed && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 tracking-wide"><XCircle size={10}/> หมดอายุ</div>
                )}
            </div>

            <div className="absolute top-0 left-[100px] -translate-x-1/2 -translate-y-1/2 size-5 bg-BG_light dark:bg-Dark_BG_light rounded-full z-20 border-b border-gray-100 dark:border-zinc-800"></div>
            <div className="absolute bottom-0 left-[100px] -translate-x-1/2 translate-y-1/2 size-5 bg-BG_light dark:bg-Dark_BG_light rounded-full z-20 border-t border-gray-100 dark:border-zinc-800"></div>
        </div>
    );
}

export default CouponCard;