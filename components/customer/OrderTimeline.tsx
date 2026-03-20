'use client';

import React from 'react';
import { ClipboardList, ChefHat, Bike, CheckCircle2, XCircle } from 'lucide-react';
import { OrderStatus } from '@prisma/client';

interface OrderTimelineProps {
    status: OrderStatus;
}

const OrderTimeline = ({ status }: OrderTimelineProps) => {
    if (status === 'CANCELLED') {
        return (
            <div className="flex items-center gap-3 text-red-500 bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                <XCircle size={24} className="animate-pulse" />
                <div>
                    <h4 className="font-bold text-sm">ออร์เดอร์ถูกยกเลิก</h4>
                    <p className="text-xs text-red-400 mt-0.5">คำสั่งซื้อนี้ถูกยกเลิกแล้ว ขออภัยในความไม่สะดวกครับ</p>
                </div>
            </div>
        );
    }

    const steps = [
        { key: 'PENDING', label: 'รอรับออร์เดอร์', icon: ClipboardList },
        { key: 'PREPARING', label: 'กำลังเตรียม', icon: ChefHat },
        { key: 'PICKED_UP', label: 'กำลังจัดส่ง', icon: Bike },
        { key: 'DELIVERED', label: 'ส่งสำเร็จ', icon: CheckCircle2 },
    ];

    let currentStepIndex = 0;
    if (status === 'PREPARING') currentStepIndex = 1;
    if (status === 'READY_FOR_PICKUP' || status === 'PICKED_UP') currentStepIndex = 2;
    if (status === 'DELIVERED') currentStepIndex = 3;

    return (
        <div className="relative py-4">
            <div className="absolute top-8 left-6 right-6 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full">
                <div
                    className="absolute top-0 left-0 h-full bg-primary dark:bg-Dark_primary rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>
            </div>

            <div className="relative flex justify-between">
                {steps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex flex-col items-center gap-2 w-1/4 z-10">
                            <div className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-subtext
                                ${isActive
                                ? 'bg-primary dark:bg-Dark_primary text-white shadow-md'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'}
                                ${isCurrent && status !== 'DELIVERED' ? 'animate-bounce' : ''}
                            `}>
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            <div className="text-center">
                                <p className={`text-[11px] md:text-xs font-bold transition-colors
                                    ${isActive ? 'text-Text dark:text-Dark_Text' : 'text-gray-400 dark:text-zinc-500'}
                                `}>
                                    {step.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTimeline;