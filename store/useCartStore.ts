import { create } from 'zustand';

// 1. กำหนดหน้าตาของของที่จะใส่ในตะกร้า
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    restaurantId: string;
    restaurantName: string;
}

// 2. กำหนดโครงสร้างของโกดัง (State & Actions)
interface CartStore {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;

    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    decreaseItem: (id: string) => void;
    clearCart: () => void;
}

// 3. สร้างโกดัง
export const useCartStore = create<CartStore>((set) => ({
    items: [],
    totalItems: 0,
    totalPrice: 0,

    addItem: (newItem) => set((state) => {
        // เช็คก่อนว่ามีอาหารนี้ในตะกร้าหรือยัง
        const existingItem = state.items.find(item => item.id === newItem.id);

        let updatedItems;
        if (existingItem) {
            // ถ้ามีแล้ว ให้บวกจำนวนเพิ่ม
            updatedItems = state.items.map(item =>
                item.id === newItem.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            // ถ้ายังไม่มี ให้เพิ่มของใหม่เข้าไป (จำนวนเริ่มต้นคือ 1)
            updatedItems = [...state.items, { ...newItem, quantity: 1 }];
        }

        return {
            items: updatedItems,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + newItem.price
        };
    }),

    removeItem: (id) => set((state) => {
        const itemToRemove = state.items.find(item => item.id === id);
        if (!itemToRemove) return state;

        const updatedItems = state.items.filter(item => item.id !== id);

        return {
            items: updatedItems,
            totalItems: state.totalItems - itemToRemove.quantity,
            totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
        };
    }),

    decreaseItem: (id) => set((state) => {
        const existingItem = state.items.find(item => item.id === id);
        if (!existingItem) return state;

        if (existingItem.quantity === 1) {
            // ถ้ามีแค่ 1 ชิ้น พอกดลบ ก็คือเอาออกจากตะกร้าเลย
            const updatedItems = state.items.filter(item => item.id !== id);
            return {
                items: updatedItems,
                totalItems: state.totalItems - 1,
                totalPrice: state.totalPrice - existingItem.price
            };
        } else {
            // ถ้ามีมากกว่า 1 ชิ้น ก็ลดจำนวนลง 1
            const updatedItems = state.items.map(item =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            );
            return {
                items: updatedItems,
                totalItems: state.totalItems - 1,
                totalPrice: state.totalPrice - existingItem.price
            };
        }
    }),

    clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}));