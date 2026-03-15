'use server';

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    secretKey?: string;
}) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
        }

        if (data.role === 'RESTAURANT') {
            const validSecret = process.env.RESTAURANT_SECRET_KEY;
            if (!data.secretKey || data.secretKey !== validSecret) {
                return { success: false, message: 'รหัสลับสำหรับร้านค้าไม่ถูกต้อง!' };
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role
            }
        });

        if (data.role === 'RESTAURANT') {
            await prisma.restaurant.create({
                data: {
                    name: `ร้านของ ${data.name}`,
                    category: 'ทั่วไป',
                    ownerId: newUser.id
                }
            });
        }

        return { success: true, message: 'สมัครสมาชิกสำเร็จ!' };

    } catch (error) {
        console.error("Register Error:", error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' };
    }
};