'use client';

import React from 'react';

interface Props {
    children: React.ReactNode;
    message: string;
    className?: string;
}

export default function ComingSoonWrapper({ children, message, className }: Props) {
    return (
        <div onClick={() => alert(message)} className={className}>
            {children}
        </div>
    );
}