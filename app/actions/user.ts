'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export const getUserProfile = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { customerProfile: true, riderProfile: true }
    });

    if (!user) return null;

    return {
        name: user.name,
        email: user.email,
        phone: user.customerProfile?.phone || user.riderProfile?.phone || '',
        address: user.customerProfile?.address || '',
        licensePlate: user.riderProfile?.licensePlate || ''
    };
};

export const updateUserProfile = async (data: { name: string, phone: string, address: string }) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { success: false, message: 'กรุณาล็อกอิน' };

        await prisma.user.update({
            where: { id: session.user.id },
            data: { name: data.name }
        });

        if (session.user.role === 'CUSTOMER') {
            await prisma.customer.update({
                where: { userId: session.user.id },
                data: { phone: data.phone, address: data.address }
            });
        }

        return { success: true, message: 'อัปเดตข้อมูลสำเร็จ!' };
    } catch (error) {
        console.error("Update Profile Error:", error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' };
    }
};