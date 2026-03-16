'use client';
import React, { useState } from 'react';
import Image from 'next/image'
import AuthModal from '@/components/menu/AuthModal';

const LandingPage = () => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [targetRole, setTargetRole] = useState<'CUSTOMER' | 'RESTAURANT' | 'DELIVERY'>('CUSTOMER');

    const handleLoginClick = (role: 'CUSTOMER' | 'RESTAURANT' | 'DELIVERY') => {
        setTargetRole(role);
        setIsAuthOpen(true);
    };

    return (
        <main className="min-h-screen bg-Main_BG dark:bg-Dark_Main_BG flex flex-col items-center justify-center p-5 relative">

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                role={targetRole}
            />

            <div className="text-center mb-12 mt-8">
                <div className="flex gap-4 items-center justify-center mb-4">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-primary dark:text-Dark_primary tracking-tight">GINHUB</h1>
                    <Image
                        src="/decorate/GinHubLogoCircle.png"
                        width={75}
                        height={75}
                        alt="GinHub Logo"
                        className="border-2 border-primary dark:border-Dark_primary rounded-full shadow-lg"
                    />
                </div>
                <p className="text-lg md:text-xl text-Text dark:text-Dark_Text max-w-lg mx-auto">
                    แพลตฟอร์มสั่งอาหารที่เชื่อมโยงความอร่อยจากร้านโปรด ถึงหน้าบ้านคุณ
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="bg-BG_light dark:bg-Dark_BG_light p-8 rounded-3xl shadow-sm hover:shadow-xl shadow-subtext/20 dark:shadow-Dark_subtext/10 transition-all text-center flex flex-col justify-between border border-gray-100 dark:border-zinc-800">
                    <div>
                        <div className="text-6xl mb-6 drop-shadow-sm">🍔</div>
                        <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text mb-3">สำหรับลูกค้า</h2>
                        <p className="text-subtext dark:text-Dark_subtext mb-8 text-sm">ค้นหาร้านอาหารอร่อยๆ สั่งง่าย ส่งไว ถึงหน้าบ้านคุณ!</p>
                    </div>
                    <button
                        onClick={() => handleLoginClick('CUSTOMER')}
                        className="w-full bg-primary dark:bg-Dark_primary text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 hover:-translate-y-1 transition-all shadow-md cursor-pointer"
                    >
                        เริ่มสั่งอาหาร
                    </button>
                </div>

                <div className="bg-BG_light dark:bg-Dark_BG_light p-8 rounded-3xl shadow-sm hover:shadow-xl shadow-subtext/20 dark:shadow-Dark_subtext/10 transition-all text-center flex flex-col justify-between border border-gray-100 dark:border-zinc-800">
                    <div>
                        <div className="text-6xl mb-6 drop-shadow-sm">🏪</div>
                        <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text mb-3">สำหรับร้านอาหาร</h2>
                        <p className="text-subtext dark:text-Dark_subtext mb-8 text-sm">จัดการเมนู ดูคำสั่งซื้อ และเพิ่มยอดขายให้ร้านของคุณ</p>
                    </div>
                    <button
                        onClick={() => handleLoginClick('RESTAURANT')}
                        className="w-full bg-power dark:bg-Dark_power text-white py-3.5 rounded-xl font-bold hover:bg-power/80 hover:-translate-y-1 transition-all shadow-md cursor-pointer"
                    >
                        เข้าสู่ระบบหลังร้าน
                    </button>
                </div>

                <div className="bg-BG_light dark:bg-Dark_BG_light p-8 rounded-3xl shadow-sm hover:shadow-xl shadow-subtext/20 dark:shadow-Dark_subtext/10 transition-all text-center flex flex-col justify-between border border-gray-100 dark:border-zinc-800">
                    <div>
                        <div className="text-6xl mb-6 drop-shadow-sm">🛵</div>
                        <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text mb-3">สำหรับไรเดอร์</h2>
                        <p className="text-subtext dark:text-Dark_subtext mb-8 text-sm">รับงานจัดส่งอาหาร สร้างรายได้ง่ายๆ ตามเวลาที่คุณต้องการ</p>
                    </div>
                    <button
                        onClick={() => handleLoginClick('DELIVERY')}
                        className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-md cursor-pointer"
                    >
                        เข้าสู่ระบบไรเดอร์
                    </button>
                </div>

            </div>
        </main>
    );
}

export default LandingPage;