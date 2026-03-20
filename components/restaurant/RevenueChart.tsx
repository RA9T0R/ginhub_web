'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface RevenueChartProps {
    data: { name: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex h-[300px] w-full flex-col items-center justify-center text-orange-500 gap-3 mt-4">
                <Loader2 className="animate-spin" size={36} />
                <p className="text-sm font-bold animate-pulse">กำลังวาดกราฟ...</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: 300 }} className="mt-4 text-sm">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#888888', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        tickFormatter={(value) => `฿${value}`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#888888', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                        contentStyle={{
                            borderRadius: '12px', border: 'none', backgroundColor: 'white', color: 'black',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: any) => [`฿${Number(value || 0).toLocaleString()}`, 'รายได้']}
                        labelStyle={{ color: '#666', fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Bar
                        dataKey="revenue"
                        fill="#f97316"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}