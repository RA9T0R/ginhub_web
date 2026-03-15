'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkoutOrders = async (cartItems: any[]) => {
    try {
        const customer = await prisma.user.findFirst({
            where: { role: 'CUSTOMER' }
        });

        if (!customer) {
            throw new Error('ไม่พบข้อมูลลูกค้าในระบบ');
        }

        const groupedByRestaurant = cartItems.reduce((acc, item) => {
            if (!acc[item.restaurantId]) {
                acc[item.restaurantId] = {
                    restaurantName: item.restaurantName,
                    items: [],
                    totalAmount: 0
                };
            }
            acc[item.restaurantId].items.push(item);
            acc[item.restaurantId].totalAmount += (item.price * item.quantity);
            return acc;
        }, {} as Record<string, { restaurantName: string, items: any[], totalAmount: number }>);

        const orderPromises = Object.entries(groupedByRestaurant).map(([restaurantId, data]) => {
            return prisma.order.create({
                data: {
                    customerId: customer.id,
                    restaurantId: restaurantId,
                    restaurantName: data.restaurantName,
                    totalAmount: data.totalAmount,
                    status: 'PENDING',
                    items: {
                        create: data.items.map((item: any) => ({
                            menuId: item.id,
                            quantity: item.quantity,
                            price: item.price,
                            imageUrl: item.imageUrl
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