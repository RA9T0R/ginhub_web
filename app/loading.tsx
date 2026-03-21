import React from 'react';
import { Loader2 } from 'lucide-react';

const GlobalLoading = () => {
    return (
        <div className="fixed inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-200">
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-orange-200 dark:border-orange-900/30 rounded-full size-16"></div>
                <Loader2 className="animate-spin text-orange-500 size-16 relative z-10" strokeWidth={2} />
            </div>
            <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">กำลังโหลดข้อมูล...</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">รอสักครู่นะครับ 🍳</p>
            </div>
        </div>
    );
}

export default GlobalLoading;