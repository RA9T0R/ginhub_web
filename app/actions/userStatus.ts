'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const getUserOnlineStatus = async () => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) return false;

    try {
        if (session.user.role === 'RESTAURANT') {
            const restaurant = await prisma.restaurant.findFirst({
                where: { ownerId: session.user.id },
                select: { isOnline: true }
            });
            return restaurant?.isOnline ?? true;
        } else if (session.user.role === 'DELIVERY') {
            const rider = await prisma.deliveryPersonnel.findFirst({
                where: { userId: session.user.id },
                select: { isOnline: true }
            });
            return rider?.isOnline ?? false;
        }
    } catch (error) {
        console.error("Error fetching online status:", error);
        return false;
    }
    return false;
};

export const toggleUserOnlineStatus = async (newStatus: boolean) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) return { success: false };

    try {
        if (session.user.role === 'RESTAURANT') {
            await prisma.restaurant.updateMany({
                where: { ownerId: session.user.id },
                data: { isOnline: newStatus }
            });
            return { success: true, status: newStatus };
        } else if (session.user.role === 'DELIVERY') {
            await prisma.deliveryPersonnel.updateMany({
                where: { userId: session.user.id },
                data: { isOnline: newStatus }
            });
            return { success: true, status: newStatus };
        }
    } catch (error) {
        console.error("Error updating online status:", error);
        return { success: false };
    }
    return { success: false };
};