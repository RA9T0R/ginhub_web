'use client';

import React, { useState, Fragment } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { Gift, X } from 'lucide-react';
import { openGiftBox } from '@/app/actions/coupon';
import toast from 'react-hot-toast';
import CouponCard from './CouponCard';

const GiftModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'OPENING' | 'GOTCHA'>('IDLE');
    const [claimedCoupon, setClaimedCoupon] = useState<any>(null);

    const closeModal = () => {
        if (loading) return;
        setIsOpen(false);
        setTimeout(() => {
            setStatus('IDLE');
            setClaimedCoupon(null);
        }, 500);
    };

    const handleOpenGiftBox = async () => {
        setLoading(true);
        setStatus('OPENING');

        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = await openGiftBox();
        setLoading(false);

        if (result.success) {
            setClaimedCoupon(result.coupon);
            setStatus('GOTCHA');
        } else {
            setStatus('IDLE');
            toast.error(result.message || 'เกิดข้อผิดพลาด');
            closeModal();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className=" text-left flex items-center gap-4 p-5 bg-Main_BG dark:bg-Dark_Main_BG shadow-xl rounded-2xl hover:bg-gray-50 dark:hover:bg-Dark_BG_dark transition-colors duration-300 group cursor-pointer"
            >
                <div className="bg-secondary/10 dark:bg-Dark_secondary/10 p-3.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Gift className="text-secondary dark:text-Dark_secondary" size={22} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-Text dark:text-Dark_Text text-[17px]">ศูนย์รวมคูปอง 🎉</h3>
                    <p className="text-sm text-subtext dark:text-Dark_subtext mt-0.5">ลุ้นรับส่วนลดประจำวัน!</p>
                </div>
                <div className="text-subtext/30 dark:text-Dark_subtext/30 group-hover:text-secondary dark:group-hover:text-Dark_secondary group-hover:translate-x-1 transition-all shrink-0">
                    เปิดกล่อง <span className="text-sm">➜</span>
                </div>
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-3xl bg-BG_light dark:bg-Dark_BG_light p-6 shadow-2xl transition-all border border-gray-100 dark:border-zinc-800">

                                    <Dialog.Title as="h3" className="text-center font-black text-Text dark:text-Dark_Text text-xl">
                                        ลุ้นรับคูปองของขวัญ ✨
                                    </Dialog.Title>

                                    <button onClick={closeModal} className="absolute top-4 right-4 text-subtext dark:text-Dark_subtext hover:bg-gray-100 dark:hover:bg-Dark_BG_dark p-1 rounded-full"><X size={20}/></button>

                                    <div className="mt-8 mb-6 text-center">

                                        {status === 'IDLE' && (
                                            <>
                                                <div className="text-8xl mb-8 animate-pulse">🎁</div>
                                                <p className="text-subtext dark:text-Dark_subtext mb-6">คุณมีสิทธิ์รับคูปองประจำวัน! ลองเปิดกล่องของขวัญดูสิ?</p>
                                                <button
                                                    onClick={handleOpenGiftBox}
                                                    disabled={loading}
                                                    className="w-full bg-secondary hover:bg-secondary/90 text-Text dark:text-Dark_Text font-extrabold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 text-lg uppercase tracking-wider"
                                                >
                                                    เปิดกล่องของขวัญ!
                                                </button>
                                            </>
                                        )}

                                        {status === 'OPENING' && (
                                            <div className="py-12 flex flex-col items-center">
                                                <div className="text-8xl mb-6 relative">
                                                    🎁
                                                    <span className="absolute -right-4 -top-4 text-4xl rotate-12">🌟</span>
                                                    <span className="absolute -left-4 top-4 text-4xl -rotate-12 animate-pulse">✨</span>
                                                </div>
                                                <p className="text-lg font-bold text-secondary dark:text-Dark_secondary animate-pulse uppercase tracking-wider">กำลังเปิดกล่องลุ้นโชค...</p>
                                            </div>
                                        )}

                                        {status === 'GOTCHA' && claimedCoupon && (
                                            <div className="animate-in fade-in">
                                                <div className="text-4xl mb-3 relative inline-block">
                                                    Gotcha! You get a coupon
                                                    <span className="absolute -left-6 top-0 text-5xl rotate-12 animate-bounce">🎁</span>
                                                    <span className="absolute -right-6 top-0 text-5xl -rotate-12 animate-bounce">🎁</span>
                                                </div>
                                                <div className="text-6xl mb-8">🎉🏆🎉</div>

                                                <CouponCard coupon={claimedCoupon} />

                                                <p className="text-xs text-subtext dark:text-Dark_subtext mt-6">คูปองนี้ถูกเก็บในกระเป๋าของคุณแล้ว! <br/> สามารถเลือกใช้ตอนสั่งอาหารในหน้าตะกร้า (Cart) ได้ทันที</p>
                                                <button onClick={closeModal} className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:scale-105 transition-transform">ขอบคุณครับ!</button>
                                            </div>
                                        )}

                                    </div>
                                </Dialog.Panel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default GiftModal;