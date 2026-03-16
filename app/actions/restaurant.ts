'use server';

import { PrismaClient, OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { success: false, message: 'กรุณาล็อกอิน' };

        const role = session.user.role;

        if (role === 'RESTAURANT') {
            const allowedForRestaurant = ['PREPARING', 'READY_FOR_PICKUP', 'CANCELLED'];
            if (!allowedForRestaurant.includes(newStatus)) {
                return { success: false, message: 'ร้านค้าไม่มีสิทธิ์เปลี่ยนเป็นสถานะนี้' };
            }
        } else if (role === 'DELIVERY') {
            const allowedForRider = ['PICKED_UP', 'DELIVERED'];
            if (!allowedForRider.includes(newStatus)) {
                return { success: false, message: 'ไรเดอร์ไม่มีสิทธิ์เปลี่ยนเป็นสถานะนี้' };
            }
        } else {
            return { success: false, message: 'ลูกค้าไม่สามารถเปลี่ยนสถานะได้' };
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });

        revalidatePath('/dashboard/orders');
        revalidatePath('/orders');
        revalidatePath('/rider');

        return { success: true };
    } catch (error) {
        console.error("Update Order Error:", error);
        return { success: false, message: 'ไม่สามารถอัปเดตสถานะได้' };
    }
};

export const updateRestaurantProfile = async (
    restaurantId: string,
    data: { name: string, category: string, description: string, imageUrl: string }
) => {
    try {
        await prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                name: data.name,
                category: data.category,
                description: data.description,
                imageUrl: data.imageUrl
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/restaurants');
        return { success: true };
    } catch (error) {
        console.error("Update Restaurant Error:", error);
        return { success: false, message: 'ไม่สามารถอัปเดตข้อมูลร้านค้าได้' };
    }
};