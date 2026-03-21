import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import CartClient from "@/components/customer/CartClient";

export const dynamic = 'force-dynamic';

const CartPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-orange-500 gap-3">
                <Loader2 className="animate-spin" size={36} />
                <p className="font-bold animate-pulse text-sm">กำลังจัดเตรียมตะกร้าสินค้า...</p>
            </div>
        }>
            <CartClient />
        </Suspense>
    );
}

export default CartPage;