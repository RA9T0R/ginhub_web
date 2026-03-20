'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export const submitOrderReview = async (
    orderId: string,
    restaurantId: string,
    riderId: string | null,
    foodRating: number,
    driverRating: number
) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'CUSTOMER') {
            return { success: false, message: 'ไม่มีสิทธิ์ดำเนินการ' };
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { orderRating: foodRating }
        });

        const restOrders = await prisma.order.findMany({
            where: { restaurantId: restaurantId, orderRating: { not: null } },
            select: { orderRating: true }
        });

        const totalRestScore = restOrders.reduce((sum, o) => sum + (o.orderRating || 0), 0);
        const newRestRating = totalRestScore / restOrders.length;

        await prisma.restaurant.update({
            where: { id: restaurantId },
            data: { rating: parseFloat(newRestRating.toFixed(1)) }
        });

        if (riderId) {
            const riderOrders = await prisma.order.findMany({
                where: { riderId: riderId, orderRating: { not: null } },
                select: { orderRating: true } // ให้ยืมใช้ orderRating ในการคำนวณชั่วคราว
            });

            const totalRiderStars = riderOrders.reduce((sum, o) => sum + (o.orderRating || 0), 0);
            const averageRiderStars = totalRiderStars / riderOrders.length;
            const newDriverScore = (averageRiderStars / 5) * 100;

            await prisma.deliveryPersonnel.update({
                where: { id: riderId },
                data: { driverScore: parseFloat(newDriverScore.toFixed(1)) }
            });
        }

        revalidatePath('/orders');
        revalidatePath('/restaurants');

        return { success: true, message: 'ขอบคุณสำหรับรีวิวครับ! 🌟' };
    } catch (error) {
        console.error("Review Error:", error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการส่งรีวิว' };
    }
};