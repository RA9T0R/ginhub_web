'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const checkoutOrders = async (cartItems: any[]) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'CUSTOMER') {
            return { success: false, message: 'กรุณาล็อกอินในฐานะลูกค้าก่อนสั่งอาหาร' };
        }

        const customerProfile = await prisma.customer.findUnique({ where: { userId: session.user.id } });
        if (!customerProfile) return { success: false, message: 'ไม่พบข้อมูลลูกค้า' };

        const availableRiders = await prisma.deliveryPersonnel.findMany();
        let assignedRiderId = null;
        if (availableRiders.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableRiders.length);
            assignedRiderId = availableRiders[randomIndex].id;
        }

        type GroupedData = Record<string, { restaurantName: string, items: any[], totalAmount: number }>;
        const groupedByRestaurant = cartItems.reduce((acc: GroupedData, item) => {
            if (!acc[item.restaurantId]) {
                acc[item.restaurantId] = { restaurantName: item.restaurantName, items: [], totalAmount: 0 };
            }
            acc[item.restaurantId].items.push(item);
            acc[item.restaurantId].totalAmount += (item.price * item.quantity);
            return acc;
        }, {});

        const orderPromises = Object.entries(groupedByRestaurant).map(([restaurantId, data]) => {
            return prisma.order.create({
                data: {
                    customerId: customerProfile.id,
                    restaurantId: restaurantId,
                    restaurantName: data.restaurantName,
                    totalAmount: data.totalAmount,
                    status: 'PENDING',
                    riderId: assignedRiderId,
                    items: {
                        create: data.items.map((item: any) => ({
                            menuId: item.id, quantity: item.quantity, price: item.price, imageUrl: item.imageUrl
                        }))
                    }
                }
            });
        });

        await Promise.all(orderPromises);
        return { success: true, message: 'สั่งอาหารสำเร็จ!' };
    } catch (error) {
        console.error("Checkout Error:", error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการสั่งอาหาร' };
    }
};