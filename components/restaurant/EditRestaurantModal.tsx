'use client';

import React, { useState, useTransition } from 'react';
import { Edit, X, Loader2, Store, Image as ImageIcon, AlignLeft, Tags } from 'lucide-react';
import { updateRestaurantProfile } from '@/app/actions/restaurant';
import { RESTAURANT_CATEGORIES } from '@/lib/constants';

interface EditRestaurantModalProps {
    restaurant: {
        id: string;
        name: string;
        category: string | null;
        description: string | null;
        imageUrl: string | null;
    }
}

export default function EditRestaurantModal({ restaurant }: EditRestaurantModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        name: restaurant.name || '',
        category: restaurant.category || '',
        description: restaurant.description || '',
        imageUrl: restaurant.imageUrl || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateRestaurantProfile(restaurant.id, formData);
            if (result.success) {
                setIsOpen(false);
            } else {
                alert(result.message);
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-sm transition-all text-sm font-medium border border-white/10"
            >
                <Edit size={16} /> แก้ไขข้อมูลร้าน
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-BG_light dark:bg-Dark_BG_light p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg w-full relative border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-200 text-left">

                        <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 text-subtext hover:text-Text dark:text-Dark_subtext transition-colors">
                            <X size={24} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text">ตั้งค่าโปรไฟล์ร้าน 🏪</h2>
                            <p className="text-sm text-subtext dark:text-Dark_subtext mt-1">อัปเดตข้อมูลให้ลูกค้าค้นหาร้านคุณเจอง่ายขึ้น</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1 flex items-center gap-2">
                                    <Store size={16} /> ชื่อร้านอาหาร *
                                </label>
                                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text" placeholder="เช่น ร้านข้าวมันไก่ เฮียหมู" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1 flex items-center gap-2">
                                    <Tags size={16} /> หมวดหมู่ (Category)
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text"
                                >
                                    <option value="">เลือกหมวดหมู่</option>

                                    {/* 2. นำข้อมูลมาวนลูปแสดงผล */}
                                    {RESTAURANT_CATEGORIES.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.emoji} {cat.name}
                                        </option>
                                    ))}

                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1 flex items-center gap-2">
                                    <AlignLeft size={16} /> คำอธิบายร้าน
                                </label>
                                <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text resize-none" placeholder="บอกจุดเด่นของร้านคุณ..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1 flex items-center gap-2">
                                    <ImageIcon size={16} /> URL รูปภาพหน้าปก (Cover Image)
                                </label>
                                <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text" placeholder="https://..." />
                            </div>

                            <button type="submit" disabled={isPending} className="w-full bg-power hover:bg-power/90 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70">
                                {isPending ? <Loader2 size={20} className="animate-spin" /> : 'บันทึกการเปลี่ยนแปลง'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}