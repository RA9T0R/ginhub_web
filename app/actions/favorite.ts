'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export const toggleFavoriteRestaurant = async (restaurantId: string) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'CUSTOMER') {
            return { success: false, message: 'กรุณาล็อกอิน' };
        }

        const customer = await prisma.customer.findUnique({
            where: { userId: session.user.id },
            include: { favoriteRestaurants: { select: { id: true } } }
        });

        if (!customer) return { success: false, message: 'ไม่พบข้อมูลลูกค้า' };

        const isFavorited = customer.favoriteRestaurants.some(r => r.id === restaurantId);

        if (isFavorited) {
            await prisma.customer.update({
                where: { id: customer.id },
                data: { favoriteRestaurants: { disconnect: { id: restaurantId } } }
            });
        } else {
            await prisma.customer.update({
                where: { id: customer.id },
                data: { favoriteRestaurants: { connect: { id: restaurantId } } }
            });
        }

        revalidatePath('/restaurants');
        revalidatePath('/favorites');

        return { success: true, isFavorited: !isFavorited };
    } catch (error) {
        console.error("Toggle Favorite Error:", error);
        return { success: false, message: 'เกิดข้อผิดพลาด' };
    }
};