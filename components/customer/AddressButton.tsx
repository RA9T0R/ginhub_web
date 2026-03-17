'use client';

import React, { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import ProfileModal from './ProfileModal';

interface AddressButtonProps {
    currentAddress: string | null;
}

export default function AddressButton({ currentAddress }: AddressButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayAddress, setDisplayAddress] = useState(currentAddress || 'ยังไม่ได้ระบุที่อยู่');

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-4 p-5 bg-BG_light dark:bg-Dark_BG_light rounded-2xl hover:bg-gray-50 dark:hover:bg-Dark_BG_dark transition-colors duration-300 group cursor-pointer"
            >
                <div className="bg-power/10 dark:bg-Dark_power/10 p-3.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="text-power dark:text-Dark_power" size={22} />
                </div>
                <div className="flex-1 overflow-hidden">
                    <h3 className="font-semibold text-Text dark:text-Dark_Text text-[17px]">ที่อยู่จัดส่ง</h3>
                    <p className="text-sm text-subtext dark:text-Dark_subtext mt-0.5 truncate">
                        {displayAddress}
                    </p>
                </div>
                <ChevronRight className="text-subtext/30 dark:text-Dark_subtext/30 group-hover:text-power dark:group-hover:text-Dark_power group-hover:translate-x-1 transition-all shrink-0" />
            </div>

            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProfileUpdated={() => window.location.reload()}
            />
        </>
    );
}