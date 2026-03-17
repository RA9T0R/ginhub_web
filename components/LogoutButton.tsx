'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
            <LogOut size={20} />
            Log out
        </button>
    );
}