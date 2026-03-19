'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export const openGiftBox = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'CUSTOMER') {
            return { success: false, message: 'กรุณาล็อกอินเพื่อรับคูปอง' };
        }

        const customer = await prisma.customer.findUnique({
            where: { userId: session.user.id }
        });

        if (!customer) return { success: false, message: 'ไม่พบข้อมูลลูกค้า' };

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const alreadyClaimedToday = await prisma.coupon.findFirst({
            where: {
                customerId: customer.id,
                createdAt: { gte: startOfDay }
            }
        });

        if (alreadyClaimedToday) {
            return {
                success: false,
                message: 'คุณรับคูปองของวันนี้ไปแล้ว พรุ่งนี้มาลุ้นใหม่นะ! 🎁'
            };
        }

        const couponPool = [
            { code: 'FREE15BAHT', description: 'ส่วนลดค่าจัดส่ง 15 บาท', type: 'FIXED', value: 15, chance: 50 },
            { code: 'DISCOUNT10', description: 'ส่วนลดค่าอาหาร 10%', type: 'PERCENTAGE', value: 10, chance: 35 },
            { code: 'DISCOUNT20', description: 'ส่วนลดค่าอาหาร 20% (สุดคุ้ม!)', type: 'PERCENTAGE', value: 20, chance: 15 },
        ];

        const randomNum = Math.random() * 100;
        let selectedCoupon = couponPool[0];

        let cumulativeChance = 0;
        for (const coupon of couponPool) {
            cumulativeChance += coupon.chance;
            if (randomNum <= cumulativeChance) {
                selectedCoupon = coupon;
                break;
            }
        }

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);

        const newCoupon = await prisma.coupon.create({
            data: {
                code: selectedCoupon.code,
                description: selectedCoupon.description,
                discountType: selectedCoupon.type as 'FIXED' | 'PERCENTAGE',
                discountValue: selectedCoupon.value,
                expiresAt: expireDate,
                customerId: customer.id
            }
        });

        revalidatePath('/profile');

        return {
            success: true,
            message: 'Gotcha! คุณได้รับคูปองใหม่แล้ว 🎉',
            coupon: newCoupon
        };

    } catch (error) {
        console.error("Open Gift Box Error:", error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการรับคูปอง' };
    }
};

export const getAvailableCoupons = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'CUSTOMER') return [];

        const customer = await prisma.customer.findUnique({
            where: { userId: session.user.id }
        });

        if (!customer) return [];

        const coupons = await prisma.coupon.findMany({
            where: {
                customerId: customer.id,
                isUsed: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        return coupons;
    } catch (error) {
        console.error("Get Coupons Error:", error);
        return [];
    }
};

export const checkHasClaimedToday = async () => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'CUSTOMER') return false;

        const customer = await prisma.customer.findUnique({
            where: { userId: session.user.id }
        });

        if (!customer) return false;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const alreadyClaimedToday = await prisma.coupon.findFirst({
            where: {
                customerId: customer.id,
                createdAt: { gte: startOfDay }
            }
        });

        return !!alreadyClaimedToday;
    } catch (error) {
        return false;
    }
};