'use client';

import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { Gift, X, Clock } from 'lucide-react';
import { openGiftBox } from '@/app/actions/coupon';
import toast from 'react-hot-toast';
import CouponCard from './CouponCard';

interface GiftModalProps {
    hasClaimedToday?: boolean;
}

const GiftModal = ({ hasClaimedToday = false }: GiftModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'OPENING' | 'GOTCHA'>('IDLE');
    const [claimedCoupon, setClaimedCoupon] = useState<any>(null);
    const [isClaimed, setIsClaimed] = useState(hasClaimedToday);

    useEffect(() => {
        setIsClaimed(hasClaimedToday);
    }, [hasClaimedToday]);

    const closeModal = () => {
        if (loading) return;
        setIsOpen(false);
        setTimeout(() => {
            setStatus('IDLE');
            setClaimedCoupon(null);
            if (status === 'GOTCHA') setIsClaimed(true);
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
            if (result.message.includes('รับคูปองของวันนี้ไปแล้ว')) {
                setIsClaimed(true);
            }
        }
    };

    return (
        <>
            {isClaimed ? (
                <div className="w-full flex items-center p-4 md:p-5 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-200 dark:border-zinc-800 cursor-not-allowed">
                    <div className="flex items-center gap-3 md:gap-4 text-gray-400 dark:text-zinc-500">
                        <div className="bg-gray-200 dark:bg-zinc-800 p-2.5 rounded-full shrink-0">
                            <Clock size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm md:text-base text-gray-500 dark:text-zinc-400">คุณรับคูปองของวันนี้ไปแล้ว</h3>
                            <p className="text-xs md:text-sm mt-0.5">กลับมาลุ้นรับส่วนลดได้ใหม่ในวันพรุ่งนี้นะครับ</p>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="cursor-pointer w-full flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-2xl text-white group"
                >
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-white/20 p-2.5 rounded-full shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                            <Gift size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm md:text-base text-white">เปิดกล่องลุ้นคูปองประจำวัน! 🎉</h3>
                            <p className="text-xs md:text-sm text-orange-50 mt-0.5">คุณมีสิทธิ์ลุ้นรับส่วนลดสุดคุ้ม 1 สิทธิ์ต่อวัน</p>
                        </div>
                    </div>
                </button>
            )}

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-BG_light dark:bg-Dark_BG_light p-6 md:p-8 shadow-2xl transition-all border border-gray-100 dark:border-zinc-800">

                                    <Dialog.Title as="h3" className="text-center font-black text-Text dark:text-Dark_Text text-xl">
                                        ลุ้นรับคูปองของขวัญ ✨
                                    </Dialog.Title>

                                    <button onClick={closeModal} className="absolute top-4 right-4 text-subtext dark:text-Dark_subtext hover:bg-gray-100 dark:hover:bg-Dark_BG_dark p-2 rounded-full transition-colors">
                                        <X size={20}/>
                                    </button>

                                    <div className="mt-8 mb-4 text-center">

                                        {status === 'IDLE' && (
                                            <div className="animate-in zoom-in-95 duration-300">
                                                <div className="text-[80px] leading-none mb-6 animate-pulse">🎁</div>
                                                <p className="text-subtext dark:text-Dark_subtext mb-8 text-sm md:text-base">
                                                    คุณมีสิทธิ์รับคูปองประจำวัน! <br/> ลองเปิดกล่องของขวัญดูสิ?
                                                </p>
                                                <button onClick={handleOpenGiftBox} disabled={loading} className="cursor-pointer w-full bg-secondary hover:bg-secondary/90 text-Text dark:text-Dark_Text font-extrabold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 text-lg uppercase tracking-wider">
                                                    เปิดกล่องของขวัญ!
                                                </button>
                                            </div>
                                        )}

                                        {status === 'OPENING' && (
                                            <div className="py-12 flex flex-col items-center">
                                                <div className="text-[80px] leading-none mb-6 relative">
                                                    🎁
                                                    <span className="absolute -right-4 -top-4 text-4xl rotate-12">🌟</span>
                                                    <span className="absolute -left-4 top-4 text-4xl -rotate-12 animate-pulse">✨</span>
                                                </div>
                                                <p className="text-lg font-bold text-secondary dark:text-Dark_secondary animate-pulse uppercase tracking-wider">
                                                    กำลังเปิดกล่องลุ้นโชค...
                                                </p>
                                            </div>
                                        )}

                                        {status === 'GOTCHA' && claimedCoupon && (
                                            <div className="animate-in zoom-in-95 duration-500">
                                                <div className="flex justify-center items-center gap-3 mb-2">
                                                    <span className="text-4xl animate-bounce">🎁</span>
                                                    <h4 className="text-3xl font-black text-secondary dark:text-Dark_secondary">ยินดีด้วย!</h4>
                                                    <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
                                                </div>
                                                <p className="text-lg font-bold text-Text dark:text-Dark_Text mb-8">
                                                    คุณได้รับคูปองส่วนลดใหม่ 🎉
                                                </p>

                                                <div className="px-2">
                                                    <CouponCard coupon={claimedCoupon} />
                                                </div>

                                                <p className="text-sm text-subtext dark:text-Dark_subtext mt-8 leading-relaxed">
                                                    คูปองนี้ถูกเก็บใน <b>กระเป๋าคูปอง</b> ของคุณแล้ว!<br/>
                                                    สามารถนำไปใช้ตอนสั่งอาหารในหน้าตะกร้า (Cart) ได้ทันที
                                                </p>

                                                <button onClick={closeModal} className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md">
                                                    ขอบคุณครับ! เก็บเข้ากระเป๋าเลย
                                                </button>
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