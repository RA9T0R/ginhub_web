'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2, Edit } from 'lucide-react';
import { createMenu, toggleMenuAvailability, deleteMenu, updateMenu } from '@/app/actions/menu';
import toast from 'react-hot-toast';

interface MenuManagerProps {
    restaurantId: string;
    restaurantName: string;
    menus: any[];
}

const MenuManager = ({ restaurantId, restaurantName, menus }: MenuManagerProps) => {
    const [isPending, startTransition] = useTransition();

    const [showForm, setShowForm] = useState(false);
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', price: '', imageUrl: '' });

    const handleOpenAdd = () => {
        setEditingMenuId(null);
        setFormData({ name: '', price: '', imageUrl: '' });
        setShowForm(true);
    };

    const handleOpenEdit = (menu: any) => {
        setEditingMenuId(menu.id);
        setFormData({ name: menu.name, price: menu.price.toString(), imageUrl: menu.imageUrl || '' });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            if (editingMenuId) {
                // โหมดแก้ไข (Edit)
                const result = await updateMenu(editingMenuId, {
                    name: formData.name,
                    price: parseFloat(formData.price),
                    imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
                });

                if (result.success) {
                    setShowForm(false);
                    toast.success('แก้ไขเมนูสำเร็จ! ✨');
                } else {
                    // @ts-ignore
                    toast.error(result.message);
                }
            } else {
                const result = await createMenu({
                    name: formData.name,
                    price: parseFloat(formData.price),
                    imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
                    restaurantId,
                    restaurantName
                });

                if (result.success) {
                    setShowForm(false);
                    toast.success('เพิ่มเมนูใหม่พร้อมขายแล้ว! 🍔');
                } else {
                    // @ts-ignore
                    toast.error(result.message);
                }
            }
        });
    };

    const handleToggle = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            const result = await toggleMenuAvailability(id, !currentStatus);
            if (result.success) {
                toast.success(!currentStatus ? 'เปิดขายเมนูนี้แล้ว ✅' : 'ปิดเมนูชั่วคราว ❌');
            } else {
                toast.error('อัปเดตสถานะไม่สำเร็จ');
            }
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?')) {
            startTransition(async () => {
                const result = await deleteMenu(id);
                if (result.success) {
                    toast.success('ลบเมนูเรียบร้อย 🗑️');
                } else {
                    toast.error(result.message || 'ไม่สามารถลบเมนูได้');
                }
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex">
                <button
                    onClick={showForm ? () => setShowForm(false) : handleOpenAdd}
                    className="bg-primary dark:bg-Dark_primary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                    {showForm ? 'ยกเลิก' : <><Plus size={20} /> เพิ่มเมนูใหม่</>}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg text-Text dark:text-Dark_Text flex items-center gap-2">
                        {editingMenuId ? <Edit size={20} className="text-orange-500"/> : <Plus size={20} className="text-orange-500"/>}
                        {editingMenuId ? 'แก้ไขรายละเอียดเมนู' : 'เพิ่มเมนูใหม่'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-subtext dark:text-Dark_subtext mb-1">ชื่อเมนู *</label>
                            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-2.5 text-Text dark:text-Dark_Text" placeholder="เช่น ผัดกะเพราหมูกรอบ" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-subtext dark:text-Dark_subtext mb-1">ราคา (บาท) *</label>
                            <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-2.5 text-Text dark:text-Dark_Text" placeholder="เช่น 60" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-subtext dark:text-Dark_subtext mb-1">URL รูปภาพอาหาร (ตัวเลือก)</label>
                            <div className="flex relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-2.5 pl-10 text-Text dark:text-Dark_Text" placeholder="https://..." />
                            </div>
                        </div>
                    </div>

                    <button disabled={isPending} type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-2.5 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        {isPending ? <Loader2 size={16} className="animate-spin" /> : (editingMenuId ? 'บันทึกการเปลี่ยนแปลง' : 'บันทึกเมนูใหม่')}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu) => (
                    <div key={menu.id} className={`bg-white dark:bg-zinc-900 rounded-xl p-4 border shadow-sm transition-all flex gap-4
                        ${menu.isAvailable ? 'border-gray-200 dark:border-zinc-800' : 'border-red-200 dark:border-red-500/30 opacity-75'}
                    `}>
                        <div className="size-20 rounded-lg bg-gray-200 dark:bg-zinc-800 overflow-hidden shrink-0">
                            <img src={menu.imageUrl} alt={menu.name} className={`w-full h-full object-cover ${!menu.isAvailable && 'grayscale'}`} />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-Text dark:text-Dark_Text line-clamp-1 pr-2">{menu.name}</h4>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={() => handleOpenEdit(menu)} disabled={isPending} className="cursor-pointer text-subtext hover:text-blue-500 transition-colors bg-gray-50 dark:bg-zinc-800 p-1.5 rounded-md">
                                        <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(menu.id)} disabled={isPending} className="cursor-pointer text-subtext hover:text-red-500 transition-colors bg-gray-50 dark:bg-zinc-800 p-1.5 rounded-md">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <p className="font-extrabold text-primary dark:text-Dark_primary">฿{menu.price}</p>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                                <span className={`text-[10px] font-bold ${menu.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                                    {menu.isAvailable ? 'พร้อมขาย' : 'ของหมด'}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={menu.isAvailable} onChange={() => handleToggle(menu.id, menu.isAvailable)} disabled={isPending} />
                                    <div className="w-8 h-4 bg-gray-300 dark:bg-zinc-600
                                    peer-focus:outline-none rounded-full peer
                                    peer-checked:bg-orange-500 dark:peer-checked:bg-orange-500
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                    after:bg-white after:border-gray-300 after:border after:rounded-full
                                    after:h-3 after:w-3 after:transition-all
                                    peer-checked:after:translate-x-4">
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default MenuManager;