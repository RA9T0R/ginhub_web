'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const RiderLogoutButton = () => {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
            title="ออกจากระบบ"
        >
            <LogOut size={20} />
        </button>
    );
}

export default RiderLogoutButton