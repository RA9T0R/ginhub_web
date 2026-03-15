import React from 'react';
import { Tag } from 'lucide-react';

const PromoBanner = () => {
    return (
        <div className="bg-gradient-to-r from-primary to-secondary dark:from-Dark_primary dark:to-Dark_secondary rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -top-6 size-24 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute right-10 -bottom-10 size-20 bg-black/10 rounded-full blur-lg"></div>

            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">
                        โปรโมชันพิเศษ!
                    </span>
                    <h2 className="text-xl font-extrabold mb-1">ลดเดือดรับสิ้นเดือน 🔥</h2>
                    <p className="text-sm opacity-90">ลดสูงสุด 50% เมื่อสั่งครบ 200 บาท</p>
                </div>
                <div className="size-12 bg-white text-primary dark:text-Dark_primary rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                    <Tag size={24} className="fill-current" />
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;