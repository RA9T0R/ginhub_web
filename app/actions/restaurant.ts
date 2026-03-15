'use server';

import { PrismaClient, OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });

        revalidatePath('/dashboard/orders');
        revalidatePath('/orders');

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