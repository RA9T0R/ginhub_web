import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Heart, MapPin, HelpCircle, Settings, Gift, ChevronRight, User } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import AddressButton from '@/components/customer/AddressButton';
import ComingSoonWrapper from '@/components/customer/ComingSoonWrapper';

const prisma = new PrismaClient();

const ProfilePage = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CUSTOMER') redirect('/');

    const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id }
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-6 mt-4 px-4 md:px-6 animate-in fade-in">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-Dark_BG_light pb-4">
                <User size={32} className="text-Text dark:text-Dark_Text" />
                <div>
                    <h1 className="text-2xl font-extrabold text-Text dark:text-Dark_Text">บัญชีของฉัน</h1>
                    <p className="text-sm text-subtext dark:text-Dark_subtext mt-1">
                        จัดการข้อมูลส่วนตัวและการตั้งค่าต่างๆ
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between bg-BG_light dark:bg-Dark_BG_light p-6 md:p-8 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                    <div className="size-14 shrink-0bg-primary/10 dark:bg-Dark_primary/10 border border-primary/20 dark:border-Dark_primary/20 rounded-full flex items-center justify-center text-3xl font-black text-primary dark:text-Dark_primary">
                        {session.user.name?.charAt(0)}
                    </div>

                    <div className="text-left md:text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-Text dark:text-Dark_Text truncate">
                            {session.user.name}
                        </h2>
                        <p className="text-sm text-subtext dark:text-Dark_subtext font-medium mt-1 truncate">
                            {session.user.email}
                        </p>
                    </div>
                </div>

                <button className="w-full md:w-auto flex items-center justify-center shadow-xl shadow-subtext dark:shadow-Dark_subtext gap-3 bg-secondary/10 dark:bg-Dark_secondary/10 hover:bg-secondary/20 dark:hover:bg-Dark_secondary/20 px-6 py-4 rounded-xl transition-all group">
                    <Gift size={24} className="text-secondary dark:text-Dark_secondary group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
                    <span className="text-sm font-bold uppercase tracking-widest text-Text dark:text-Dark_Text group-hover:text-secondary dark:group-hover:text-Dark_secondary transition-colors">
                        คูปองของฉัน
                    </span>
                </button>
            </div>

            {/* ✅ Menu Grid: ลบ Border ออก ใช้ Hover เพื่อเปลี่ยนสีพื้นหลังให้ดูมีมิติแทน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Link href="/favorites" className="flex items-center gap-4 p-5 bg-BG_light dark:bg-Dark_BG_light rounded-2xl hover:bg-gray-50 dark:hover:bg-Dark_BG_dark transition-colors duration-300 group">
                    <div className="bg-primary/10 dark:bg-Dark_primary/10 p-3.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Heart className="text-primary dark:text-Dark_primary" size={22} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-Text dark:text-Dark_Text text-[17px]">ร้านอาหารโปรด</h3>
                        <p className="text-sm text-subtext dark:text-Dark_subtext mt-0.5">Favorite restaurants</p>
                    </div>
                    <ChevronRight className="text-subtext/30 dark:text-Dark_subtext/30 group-hover:text-primary dark:group-hover:text-Dark_primary group-hover:translate-x-1 transition-all shrink-0" />
                </Link>

                <AddressButton currentAddress={customer?.address || null} />

                <ComingSoonWrapper
                    message="หน้าศูนย์ช่วยเหลือกำลังอยู่ในการพัฒนาครับ 🛠️"
                    className="flex items-center gap-4 p-5 bg-BG_light dark:bg-Dark_BG_light rounded-2xl hover:bg-gray-50 dark:hover:bg-Dark_BG_dark transition-colors duration-300 group cursor-pointer"
                >
                    <div className="bg-secondary/10 dark:bg-Dark_secondary/10 p-3.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <HelpCircle className="text-secondary dark:text-Dark_secondary" size={22} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-Text dark:text-Dark_Text text-[17px]">ศูนย์ช่วยเหลือ</h3>
                        <p className="text-sm text-subtext dark:text-Dark_subtext mt-0.5">Help center</p>
                    </div>
                    <ChevronRight className="text-subtext/30 dark:text-Dark_subtext/30 group-hover:text-secondary dark:group-hover:text-Dark_secondary group-hover:translate-x-1 transition-all shrink-0" />
                </ComingSoonWrapper>

                <ComingSoonWrapper
                    message="หน้าตั้งค่ากำลังอยู่ในการพัฒนาครับ 🛠️"
                    className="flex items-center gap-4 p-5 bg-BG_light dark:bg-Dark_BG_light rounded-2xl hover:bg-gray-50 dark:hover:bg-Dark_BG_dark transition-colors duration-300 group cursor-pointer"
                >
                    <div className="bg-BG_dark dark:bg-Dark_BG_dark p-3.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Settings className="text-Text dark:text-Dark_Text" size={22} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-Text dark:text-Dark_Text text-[17px]">การตั้งค่า</h3>
                        <p className="text-sm text-subtext dark:text-Dark_subtext mt-0.5">Settings</p>
                    </div>
                    <ChevronRight className="text-subtext/30 dark:text-Dark_subtext/30 group-hover:text-Text dark:group-hover:text-Dark_Text group-hover:translate-x-1 transition-all shrink-0" />
                </ComingSoonWrapper>
            </div>

            {/* Logout Section */}
            <div className="w-full mt-2">
                <LogoutButton />
            </div>

        </div>
    );
};

export default ProfilePage;