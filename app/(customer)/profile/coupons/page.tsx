import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Ticket, ChevronLeft } from 'lucide-react';
import CouponCard from '@/components/customer/CouponCard';
import GiftModal from '@/components/customer/GiftModal';
import { checkHasClaimedToday } from '@/app/actions/coupon';

const prisma = new PrismaClient();

const MyCouponsPage = async ({ searchParams }: { searchParams: Promise<{ tab?: string }> }) => {
    const { tab } = await searchParams;
    const currentTab = tab || 'available';

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CUSTOMER') redirect('/');

    const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id }
    });

    if (!customer) redirect('/');

    const allCoupons = await prisma.coupon.findMany({
        where: { customerId: customer.id },
        orderBy: { expiresAt: 'asc' }
    });

    const now = new Date();
    const hasClaimedToday = await checkHasClaimedToday();

    const availableCoupons = allCoupons.filter(c => !c.isUsed && c.expiresAt && new Date(c.expiresAt) > now);
    const historyCoupons = allCoupons.filter(c => c.isUsed || (c.expiresAt && new Date(c.expiresAt) <= now));

    const displayCoupons = currentTab === 'history' ? historyCoupons : availableCoupons;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-6 mt-4 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 border-b border-gray-200 dark:border-zinc-800 py-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 dark:bg-Dark_secondary/10 p-2.5 rounded-xl shrink-0">
                            <Ticket size={28} className="text-secondary dark:text-Dark_secondary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-Text dark:text-Dark_Text tracking-tight">กระเป๋าคูปอง</h1>
                            <p className="text-sm text-subtext dark:text-Dark_subtext mt-0.5">
                                คูปองส่วนลดทั้งหมดของคุณ
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto flex md:justify-end">
                    <GiftModal hasClaimedToday={hasClaimedToday} />
                </div>
            </div>

            <div className="flex gap-2 bg-gray-100 dark:bg-zinc-900/50 p-1 rounded-xl mb-6 w-full md:w-fit">
                <Link
                    href="/profile/coupons?tab=available"
                    className={`flex-1 md:w-40 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${currentTab === 'available' ? 'bg-white dark:bg-zinc-800 text-Text dark:text-Dark_Text shadow-sm' : 'text-subtext dark:text-Dark_subtext hover:text-Text dark:hover:text-Dark_Text'}`}
                >
                    ใช้งานได้ ({availableCoupons.length})
                </Link>
                <Link
                    href="/profile/coupons?tab=history"
                    className={`flex-1 md:w-40 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${currentTab === 'history' ? 'bg-white dark:bg-zinc-800 text-Text dark:text-Dark_Text shadow-sm' : 'text-subtext dark:text-Dark_subtext hover:text-Text dark:hover:text-Dark_Text'}`}
                >
                    ประวัติ ({historyCoupons.length})
                </Link>
            </div>

            {displayCoupons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-BG_light dark:bg-Dark_BG_light rounded-3xl border border-gray-100 dark:border-zinc-800 text-center px-4 shadow-sm">
                    <div className="size-24 bg-gray-50 dark:bg-zinc-950 rounded-full flex items-center justify-center mb-6 text-gray-400">
                        <Ticket size={48} className="opacity-30"/>
                    </div>
                    <h3 className="text-xl font-bold text-Text dark:text-Dark_Text mb-2">
                        {currentTab === 'available' ? 'คุณยังไม่มีคูปองที่ใช้งานได้เลย' : 'ยังไม่มีประวัติการใช้คูปอง'}
                    </h3>
                    <p className="text-subtext dark:text-Dark_subtext text-sm max-w-sm leading-relaxed">
                        {currentTab === 'available'
                            ? 'กดเปิดกล่องของขวัญด้านบนเพื่อลุ้นรับส่วนลดสุดคุ้มดูสิครับ!'
                            : 'คูปองที่ถูกใช้แล้ว หรือคูปองที่หมดอายุ จะมาแสดงอยู่ในหน้านี้ครับ'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayCoupons.map(coupon => (
                        <CouponCard key={coupon.id} coupon={coupon as any} />
                    ))}
                </div>
            )}

        </div>
    );
};

export default MyCouponsPage;