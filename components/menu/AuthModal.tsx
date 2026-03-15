'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X, Loader2 } from 'lucide-react';
import { registerUser } from '@/app/actions/auth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: 'CUSTOMER' | 'RESTAURANT';
}

export default function AuthModal({ isOpen, onClose, role }: AuthModalProps) {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretKey, setSecretKey] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const redirectUrl = role === 'RESTAURANT' ? '/dashboard' : '/restaurants';

        if (isLoginMode) {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                window.location.href = redirectUrl;
            }
        } else {
            const registerResult = await registerUser({
                name,
                email,
                password,
                role,
                secretKey: role === 'RESTAURANT' ? secretKey : undefined
            });

            if (!registerResult.success) {
                setError(registerResult.message);
                setIsLoading(false);
                return;
            }

            await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            window.location.href = redirectUrl;
        }
    };

    const themeColor = role === 'RESTAURANT' ? 'bg-power hover:bg-power/80' : 'bg-primary hover:bg-orange-600';
    const titleText = role === 'RESTAURANT'
        ? (isLoginMode ? 'เข้าสู่ระบบร้านอาหาร' : 'สมัครเปิดร้านอาหาร')
        : (isLoginMode ? 'เข้าสู่ระบบลูกค้า' : 'สมัครสมาชิกใหม่');

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setName('');
        setSecretKey('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-BG_light dark:bg-Dark_BG_light p-8 rounded-3xl shadow-2xl max-w-md w-full relative border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">

                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-subtext hover:text-Text dark:text-Dark_subtext dark:hover:text-Dark_Text transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-Text dark:text-Dark_Text mb-2">{titleText}</h2>
                    <p className="text-sm text-subtext dark:text-Dark_subtext">
                        {role === 'RESTAURANT'
                            ? 'จัดการร้านค้าของคุณเพื่อเพิ่มยอดขาย'
                            : 'สั่งอาหารอร่อยๆ ส่งตรงถึงหน้าบ้านคุณ'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    {!isLoginMode && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1">
                                {role === 'RESTAURANT' ? 'ชื่อร้าน / ชื่อเจ้าของ' : 'ชื่อ-นามสกุล'}
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="เช่น สมชาย ใจดี"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1">อีเมล</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder={role === 'RESTAURANT' ? 'owner1@ginhub.com' : 'somchai@customer.com'}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1">รหัสผ่าน</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 text-Text dark:text-Dark_Text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLoginMode && role === 'RESTAURANT' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-medium text-Text dark:text-Dark_Text mb-1">รหัสลับยืนยันสิทธิ์ (Secret Key)</label>
                            <input
                                type="password"
                                required
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                className="w-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl p-3 text-Text dark:text-Dark_Text focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                placeholder="รหัสเชิญจากระบบ"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 ${themeColor}`}
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isLoginMode ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-subtext dark:text-Dark_subtext">
                        {isLoginMode ? 'ยังไม่มีบัญชีใช่ไหม?' : 'มีบัญชีอยู่แล้ว?'}
                        <button
                            onClick={toggleMode}
                            className="ml-2 font-bold text-primary dark:text-Dark_primary hover:underline"
                        >
                            {isLoginMode ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                        </button>
                    </p>
                </div>

                {isLoginMode && (
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setEmail(role === 'RESTAURANT' ? 'owner1@ginhub.com' : 'somchai@customer.com');
                                setPassword('password123');
                            }}
                            className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors"
                        >
                            [Dev Mode] เติมข้อมูลทดสอบ
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}