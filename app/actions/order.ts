'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const checkoutOrders = async (cartItems: any[], couponId?: string | null) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'CUSTOMER') {
            return { success: false, message: 'กรุณาล็อกอินในฐานะลูกค้าก่อนสั่งอาหาร' };
        }

        const customerProfile = await prisma.customer.findUnique({ where: { userId: session.user.id } });
        if (!customerProfile) return { success: false, message: 'ไม่พบข้อมูลลูกค้า' };

        let validCoupon = null;
        let totalDiscountAmount = 0;

        if (couponId) {
            validCoupon = await prisma.coupon.findFirst({
                where: {
                    id: couponId,
                    customerId: customerProfile.id,
                    isUsed: false
                }
            });

            if (!validCoupon) {
                return { success: false, message: 'คูปองไม่ถูกต้อง หรือถูกใช้งานไปแล้ว' };
            }

            if (validCoupon.expiresAt && new Date(validCoupon.expiresAt) < new Date()) {
                return { success: false, message: 'คูปองนี้หมดอายุแล้ว' };
            }

            const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            if (validCoupon.discountType === 'PERCENTAGE') {
                totalDiscountAmount = (totalCartPrice * validCoupon.discountValue) / 100;
            } else {
                totalDiscountAmount = validCoupon.discountValue;
            }
        }

        const availableRiders = await prisma.deliveryPersonnel.findMany({
            where: { isOnline: true }
        });
        if (availableRiders.length === 0) {
            return {
                success: false,
                message: 'ขออภัยครับ ขณะนี้ไม่มีไรเดอร์พร้อมให้บริการ กรุณาลองใหม่ในภายหลัง 🛵'
            };
        }
        const randomIndex = Math.floor(Math.random() * availableRiders.length);
        const assignedRiderId = availableRiders[randomIndex].id;

        type GroupedData = Record<string, { restaurantName: string, items: any[], totalAmount: number }>;
        const groupedByRestaurant = cartItems.reduce((acc: GroupedData, item) => {
            if (!acc[item.restaurantId]) {
                acc[item.restaurantId] = { restaurantName: item.restaurantName, items: [], totalAmount: 0 };
            }
            acc[item.restaurantId].items.push(item);
            acc[item.restaurantId].totalAmount += (item.price * item.quantity);
            return acc;
        }, {});

        let isCouponApplied = false;

        const orderPromises = Object.entries(groupedByRestaurant).map(([restaurantId, data]) => {

            let currentOrderDiscount = 0;
            let appliedCouponId = undefined;

            if (validCoupon && !isCouponApplied) {
                currentOrderDiscount = Math.min(totalDiscountAmount, data.totalAmount + 15);
                appliedCouponId = validCoupon.id;
                isCouponApplied = true;
            }

            return prisma.order.create({
                data: {
                    customerId: customerProfile.id,
                    restaurantId: restaurantId,
                    restaurantName: data.restaurantName,
                    totalAmount: data.totalAmount,
                    discountAmount: currentOrderDiscount,
                    couponId: appliedCouponId,
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

        if (validCoupon && isCouponApplied) {
            await prisma.coupon.update({
                where: { id: validCoupon.id },
                data: { isUsed: true }
            });
        }

        return { success: true, message: 'สั่งอาหารสำเร็จ!' };
    } catch (error) {
        console.error("Checkout Error:", error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการสั่งอาหาร' };
    }
};