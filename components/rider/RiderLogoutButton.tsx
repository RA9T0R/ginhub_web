'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const RiderLogoutButton = () => {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 bg-Main_BG dark:bg-Dark_Main_BG text-Text dark:text-Dark_Text rounded-full transition-colors"
            title="ออกจากระบบ"
        >
            <LogOut size={20} />
        </button>
    );
}

export default RiderLogoutButton