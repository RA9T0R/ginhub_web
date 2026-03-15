'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export const createMenu = async (data: { name: string, price: number, imageUrl: string, restaurantId: string, restaurantName: string }) => {
    try {
        await prisma.menu.create({ data });
        revalidatePath('/dashboard/menus'); // สั่งรีเฟรชหน้า
        return { success: true };
    } catch (error) {
        return { success: false, message: 'เพิ่มเมนูไม่สำเร็จ' };
    }
};

export const toggleMenuAvailability = async (menuId: string, isAvailable: boolean) => {
    try {
        await prisma.menu.update({
            where: { id: menuId },
            data: { isAvailable }
        });
        revalidatePath('/dashboard/menus');
        // รีเฟรชหน้าฝั่งลูกค้าด้วย เพื่อให้ลูกค้าเห็นว่าของหมดแล้ว
        revalidatePath('/restaurants/[id]', 'page');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'อัปเดตสถานะไม่สำเร็จ' };
    }
};

export const deleteMenu = async (menuId: string) => {
    try {
        await prisma.menu.delete({ where: { id: menuId } });
        revalidatePath('/dashboard/menus');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'ลบเมนูไม่สำเร็จ (อาจมีออร์เดอร์ค้างอยู่)' };
    }
};

export const updateMenu = async (menuId: string, data: { name: string, price: number, imageUrl: string }) => {
    try {
        await prisma.menu.update({
            where: { id: menuId },
            data: {
                name: data.name,
                price: data.price,
                imageUrl: data.imageUrl
            }
        });

        revalidatePath('/dashboard/menus');
        revalidatePath('/restaurants/[id]', 'page');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'แก้ไขเมนูไม่สำเร็จ' };
    }
};