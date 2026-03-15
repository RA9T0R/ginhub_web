'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, MapPin, Phone, User } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '@/app/actions/user';
import toast from 'react-hot-toast';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdated: () => void;
}

export default function ProfileModal({ isOpen, onClose, onProfileUpdated }: ProfileModalProps) {
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsFetching(true);
            getUserProfile().then((data) => {
                if (data) {
                    setFormData({
                        name: data.name || '',
                        phone: data.phone || '',
                        address: data.address || ''
                    });
                }
                setIsFetching(false);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateUserProfile(formData);

        setIsLoading(false);
        if (result.success) {
            toast.success('อัปเดตที่อยู่สำเร็จแล้ว! 🛵');
            onProfileUpdated();
            onClose();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-BG_light dark:bg-Dark_BG_light p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">

                <button onClick={onClose} className="absolute top-5 right-5 text-subtext hover:text-Text dark:text-Dark_subtext dark:hover:text-Dark_Text transition-colors">
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text">ข้อมูลจัดส่ง 🛵</h2>
                    <p className="text-sm text-subtext dark:text-Dark_subtext mt-1">อัปเดตที่อยู่เพื่อให้ไรเดอร์ส่งอาหารถึงมือคุณ</p>
                </div>

                {isFetching ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1 flex items-center gap-2">
                                <User size={16} /> ชื่อ-นามสกุล
                            </label>
                            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1 flex items-center gap-2">
                                <Phone size={16} /> เบอร์โทรศัพท์
                            </label>
                            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text" placeholder="เช่น 0812345678" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1 flex items-center gap-2">
                                <MapPin size={16} /> ที่อยู่จัดส่ง
                            </label>
                            <textarea required rows={3} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text resize-none" placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล..." />
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70">
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'บันทึกข้อมูล'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}