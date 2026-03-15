'use client';
import React, { useState } from 'react';
import Image from 'next/image'
import AuthModal from '@/components/menu/AuthModal';

const LandingPage = () => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [targetRole, setTargetRole] = useState<'CUSTOMER' | 'RESTAURANT'>('CUSTOMER');

    const handleLoginClick = (role: 'CUSTOMER' | 'RESTAURANT') => {
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

            <div className="text-center mb-12">
                <div className="flex gap-4 items-center justify-center mb-4">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-primary dark:text-Dark_primary">GINHUB</h1>
                    <Image
                        src="/decorate/GinHubLogoCircle.png"
                        width={75}
                        height={75}
                        alt="GinHub Logo"
                        className="border-2 border-primary dark:border-Dark_primary rounded-full"
                    />
                </div>
                <p className="text-xl text-Text dark:text-Dark_Text max-w-md mx-auto">
                    แพลตฟอร์มสั่งอาหารที่เชื่อมโยงความอร่อยจากร้านโปรด ถึงหน้าบ้านคุณ
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">

                <div className="flex-1 bg-BG_light dark:bg-Dark_BG_light p-8 rounded-2xl shadow-sm hover:shadow-lg shadow-subtext dark:shadow-Dark_subtext transition-shadow text-center">
                    <div className="text-5xl mb-4">🍔</div>
                    <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text mb-2">สำหรับลูกค้า</h2>
                    <p className="text-subtext dark:text-Dark_subtext mb-6">ค้นหาร้านอาหารอร่อยๆ และสั่งเลย!</p>
                    <button
                        onClick={() => handleLoginClick('CUSTOMER')} // ✅ เปลี่ยนจาก Link เป็น button
                        className="block w-full bg-primary dark:bg-Dark_primary text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all cursor-pointer"
                    >
                        เริ่มสั่งอาหาร
                    </button>
                </div>

                <div className="flex-1 bg-BG_light dark:bg-Dark_BG_light p-8 rounded-2xl shadow-sm hover:shadow-lg shadow-subtext dark:shadow-Dark_subtext transition-shadow text-center">
                    <div className="text-5xl mb-4">🏪</div>
                    <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text mb-2">สำหรับร้านอาหาร</h2>
                    <p className="text-subtext dark:text-Dark_subtext mb-6">จัดการเมนู ดูคำสั่งซื้อ และเพิ่มยอดขาย</p>
                    <button
                        onClick={() => handleLoginClick('RESTAURANT')} // ✅ เปลี่ยนจาก Link เป็น button
                        className="block w-full bg-power dark:bg-Dark_power text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all cursor-pointer"
                    >
                        เข้าสู่ระบบหลังร้าน
                    </button>
                </div>

            </div>
        </main>
    );
}

export default LandingPage;