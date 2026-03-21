import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Star, TrendingUp, ShieldCheck, Phone, Mail, MapPin, CarFront } from 'lucide-react';
import RiderLogoutButton from '@/components/rider/RiderLogoutButton';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

const RiderProfilePage = async () => {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'DELIVERY') redirect('/');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { riderProfile: true }
    });

    if (!user || !user.riderProfile) {
        return <div className="p-8 text-center">ไม่พบข้อมูลโปรไฟล์ไรเดอร์ กรุณาติดต่อแอดมิน</div>;
    }

    const { driverScore, acceptanceRate, phone, licensePlate } = user.riderProfile;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className="size-24 rounded-full bg-primary/50 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-4xl mx-auto mb-4 border-4 border-white dark:border-zinc-950 shadow-md">
                    {user.name.charAt(0)}
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
                    <ShieldCheck size={16} className="text-green-500" /> ไรเดอร์ที่ยืนยันตัวตนแล้ว
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
                    <Star className="text-yellow-400 mx-auto mb-2" size={28} />
                    <p className="text-xs text-gray-500 font-bold uppercase">Driver Score</p>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{driverScore}%</h2>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm text-center">
                    <TrendingUp className="text-blue-500 mx-auto mb-2" size={28} />
                    <p className="text-xs text-gray-500 font-bold uppercase">Acceptance Rate</p>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{acceptanceRate}%</h2>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">ข้อมูลติดต่อและยานพาหนะ</h3>

                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <Mail size={20} className="text-gray-400" />
                    <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <Phone size={20} className="text-gray-400" />
                    <span className="text-sm font-medium">{phone || 'ยังไม่ระบุเบอร์โทร'}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <CarFront size={20} className="text-gray-400" />
                    <span className="text-sm font-medium">ป้ายทะเบียน: {licensePlate || 'ยังไม่ระบุ'}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <MapPin size={20} className="text-gray-400" />
                    <span className="text-sm font-medium">พื้นที่รับงาน: กรุงเทพมหานคร</span>
                </div>
            </div>

            <div className="md:hidden pt-4">
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/50 rounded-2xl p-4 flex justify-center">
                    <RiderLogoutButton />
                </div>
            </div>

        </div>
    );
};

export default RiderProfilePage;