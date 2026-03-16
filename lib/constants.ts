import { LayoutDashboard, ListOrdered, Utensils } from 'lucide-react';
import { Home, Wallet, ClockFading, User } from 'lucide-react';

export const sidebarMenu = [
    { name: 'ภาพรวม (Dashboard)', path: '/dashboard', icon: LayoutDashboard },
    { name: 'ออร์เดอร์ลูกค้า', path: '/dashboard/orders', icon: ListOrdered },
    { name: 'จัดการเมนูอาหาร', path: '/dashboard/menus', icon: Utensils },
];

export const navItems = [
    { name: 'หน้าหลัก', path: '/rider', icon: Home },
    { name: 'รายได้', path: '/rider/wallet', icon: Wallet },
    { name: 'ประวัติ', path: '/rider/history', icon: ClockFading },
    { name: 'โปรไฟล์', path: '/rider/profile', icon: User },
];


export interface CategoryType {
    id: number;
    name: string;
    emoji: string;
}

export const RESTAURANT_CATEGORIES: CategoryType[] = [
    { id: 1, name: 'อาหารไทย', emoji: '🇹🇭' },
    { id: 2, name: 'ตามสั่ง', emoji: '🍛' },
    { id: 3, name: 'เส้น/ก๋วยเตี๋ยว', emoji: '🍜' },
    { id: 4, name: 'ยำ/ส้มตำ', emoji: '🥗' },
    { id: 5, name: 'ไก่ทอด', emoji: '🍗' },
    { id: 6, name: 'ฟาสต์ฟู้ด', emoji: '🍔' },
    { id: 7, name: 'ของหวาน', emoji: '🍰' },
    { id: 8, name: 'เครื่องดื่ม', emoji: '🧋' },
];
// ในอนาคตถ้ามีเมนูของฝั่งลูกค้า (Customer) ที่ต้องใช้ซ้ำ ก็เอามาต่อท้ายไฟล์นี้ได้เลยครับ