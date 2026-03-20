import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 กำลังเริ่มสร้างข้อมูลจำลองชุดใหญ่ (Master Seed V5 - All Restaurants Edition)...')

    // ----------------------------------------------------
    // 1. ล้างข้อมูลเก่า
    // ----------------------------------------------------
    console.log('  - ล้างข้อมูลเก่า...')
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.coupon.deleteMany()
    await prisma.menu.deleteMany()
    await prisma.restaurant.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.deliveryPersonnel.deleteMany()
    await prisma.user.deleteMany()

    const hashedPassword = await bcrypt.hash('password123', 10)

    // ----------------------------------------------------
    // 2. สร้างบัญชีผู้ใช้หลัก (Users)
    // ----------------------------------------------------
    console.log('  - สร้างบัญชีผู้ใช้...')
    const userPool = await Promise.all([
        prisma.user.create({ data: { name: 'เฮียหมู', email: 'owner1@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'เจ๊จู', email: 'owner2@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'บังซา', email: 'owner3@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'เชฟโทยะ', email: 'owner4@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),

        prisma.user.create({ data: { name: 'สมชาย สายกิน', email: 'somchai@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
        prisma.user.create({ data: { name: 'สมหญิง รักสุขภาพ', email: 'somying@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
        prisma.user.create({ data: { name: 'จอห์น ชาวไร่', email: 'john@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
        prisma.user.create({ data: { name: 'แอนดี้ สายเปย์', email: 'andy@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
        prisma.user.create({ data: { name: 'น้องนุ่น หิวบ่อย', email: 'noon@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),

        prisma.user.create({ data: { name: 'พี่วิน บิดมิดไมล์', email: 'rider1@ginhub.com', password: hashedPassword, role: 'DELIVERY' } }),
        prisma.user.create({ data: { name: 'น้องบอย สายซิ่ง', email: 'rider2@ginhub.com', password: hashedPassword, role: 'DELIVERY' } }),
        prisma.user.create({ data: { name: 'ลุงพล คนขยัน', email: 'rider3@ginhub.com', password: hashedPassword, role: 'DELIVERY' } }),
    ])

    // ----------------------------------------------------
    // 3. สร้าง Profile ย่อย
    // ----------------------------------------------------
    console.log('  - สร้างโปรไฟล์ย่อย...')
    const customers = await Promise.all([
        prisma.customer.create({ data: { userId: userPool[4].id, address: '123 ซอยสุขุมวิท 10, กรุงเทพ', phone: '081-234-5678' } }),
        prisma.customer.create({ data: { userId: userPool[5].id, address: 'คอนโด A ชั้น 15, พระราม 9', phone: '089-876-5432' } }),
        prisma.customer.create({ data: { userId: userPool[6].id, address: 'หอพักหน้ามหาวิทยาลัย, นนทบุรี', phone: '085-555-4444' } }),
        prisma.customer.create({ data: { userId: userPool[7].id, address: 'หมู่บ้านเศรษฐี, บางนา', phone: '082-222-3333' } }),
        prisma.customer.create({ data: { userId: userPool[8].id, address: 'อพาร์ทเมนท์ B, ลาดพร้าว', phone: '083-333-4444' } }),
    ])

    const riders = await Promise.all([
        prisma.deliveryPersonnel.create({ data: { userId: userPool[9].id, phone: '091-111-1111', licensePlate: '1กข 1234', balance: 1450.0, driverScore: 98.5 } }),
        prisma.deliveryPersonnel.create({ data: { userId: userPool[10].id, phone: '092-222-2222', licensePlate: '2คง 5678', balance: 520.0, driverScore: 92.0 } }),
        prisma.deliveryPersonnel.create({ data: { userId: userPool[11].id, phone: '093-333-3333', licensePlate: '3จฉ 9012', balance: 890.0, driverScore: 99.9 } }),
    ])

    // ----------------------------------------------------
    // 4. สร้างร้านอาหาร
    // ----------------------------------------------------
    console.log('  - สร้างร้านอาหาร...')
    const rest1 = await prisma.restaurant.create({ data: { name: 'ข้าวมันไก่เฮียหมู (เจ้าเก่า)', category: 'ตามสั่ง', description: 'ไก่ตอนเนื้อนุ่ม ข้าวมันหอมกรุ่น น้ำจิ้มรสเด็ด', imageUrl: 'https://images.unsplash.com/photo-1626804475297-4160ebea0364?w=800&q=80', ownerId: userPool[0].id, rating: 4.8 } })
    const rest2 = await prisma.restaurant.create({ data: { name: 'เจ๊จู ผัดกะเพราพริกแห้ง', category: 'ตามสั่ง', description: 'กะเพราแท้ไม่ใส่ถั่วฝักยาว เผ็ดร้อนถึงใจ', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', ownerId: userPool[1].id, rating: 4.5 } })
    const rest3 = await prisma.restaurant.create({ data: { name: 'บังซา ข้าวหมกไก่', category: 'ทั่วไป', description: 'อาหารฮาลาลแท้ ต้นตำรับจากยะลา', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', ownerId: userPool[2].id, rating: 4.7 } })
    const rest4 = await prisma.restaurant.create({ data: { name: 'Toya Sushi Premium', category: 'ทั่วไป', description: 'ซูชิพรีเมียม วัตถุดิบส่งตรงจากโอซาก้า', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', ownerId: userPool[3].id, rating: 4.9 } })

    // ----------------------------------------------------
    // 5. สร้างเมนู
    // ----------------------------------------------------
    console.log('  - สร้างเมนู...')
    const menuData = [

        { name: 'ข้าวมันไก่ต้ม (ธรรมดา)', price: 50, restaurantId: rest1.id, restaurantName: rest1.name, imageUrl: 'https://images.unsplash.com/photo-1626804475297-4160ebea0364?w=500&q=80' },
        { name: 'ข้าวมันไก่ทอด', price: 55, restaurantId: rest1.id, restaurantName: rest1.name, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80' },
        { name: 'ข้าวมันไก่ผสม', price: 65, restaurantId: rest1.id, restaurantName: rest1.name, imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?w=500&q=80' },

        { name: 'กะเพราหมูสับไข่ดาว', price: 60, restaurantId: rest2.id, restaurantName: rest2.name, imageUrl: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=500&q=80' },
        { name: 'กะเพราเนื้อโคขุน', price: 85, restaurantId: rest2.id, restaurantName: rest2.name, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80' },
        { name: 'กะเพราทะเลรวม', price: 95, restaurantId: rest2.id, restaurantName: rest2.name, imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&q=80' },

        { name: 'ข้าวหมกไก่', price: 60, restaurantId: rest3.id, restaurantName: rest3.name, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
        { name: 'ซุปหางวัว', price: 120, restaurantId: rest3.id, restaurantName: rest3.name, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80' },

        { name: 'Salmon Set', price: 299, restaurantId: rest4.id, restaurantName: rest4.name, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80' },
        { name: 'Unagi Don', price: 350, restaurantId: rest4.id, restaurantName: rest4.name, imageUrl: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&q=80' },
    ]

    for (const menu of menuData) { await prisma.menu.create({ data: menu }) }
    const allMenus = await prisma.menu.findMany()

    // ----------------------------------------------------
    // 6. จำลองระบบคูปอง
    // ----------------------------------------------------
    console.log('  - เตรียมระบบวันที่ และ คูปอง...')
    const d0 = new Date();
    const d1 = new Date(); d1.setDate(d1.getDate() - 1);
    const d2 = new Date(); d2.setDate(d2.getDate() - 2);
    const d3 = new Date(); d3.setDate(d3.getDate() - 3);
    const d4 = new Date(); d4.setDate(d4.getDate() - 4);
    const d5 = new Date(); d5.setDate(d5.getDate() - 5);
    const d6 = new Date(); d6.setDate(d6.getDate() - 6);

    const futureDate = new Date(); futureDate.setDate(futureDate.getDate() + 7);

    const coupons = await Promise.all([
        prisma.coupon.create({ data: { customerId: customers[0].id, code: 'GINHUB20', description: 'ลดค่าอาหาร 20%', discountType: 'PERCENTAGE', discountValue: 20, isUsed: false, expiresAt: futureDate } }),
        prisma.coupon.create({ data: { customerId: customers[0].id, code: 'WELCOME100', description: 'ลด 100 บาท', discountType: 'FIXED', discountValue: 100, isUsed: true, expiresAt: futureDate } }),
    ])

    // ----------------------------------------------------
    // 7. สร้างประวัติคำสั่งซื้อแบบเต็ม 7 วัน ให้ครบทั้ง 4 ร้าน
    // ----------------------------------------------------
    console.log('  - อัดประวัติคำสั่งซื้อย้อนหลัง 7 วันให้ทุกร้าน...')

    const orderData = [
        { date: d6, cust: 1, rest: 0, menuIndex: 0, qty: 2, status: 'DELIVERED', rider: 0 },
        { date: d6, cust: 2, rest: 1, menuIndex: 3, qty: 1, status: 'DELIVERED', rider: 1 },
        { date: d6, cust: 3, rest: 2, menuIndex: 6, qty: 2, status: 'DELIVERED', rider: 2 },
        { date: d6, cust: 4, rest: 3, menuIndex: 8, qty: 1, status: 'DELIVERED', rider: 0 },

        { date: d5, cust: 0, rest: 0, menuIndex: 1, qty: 1, status: 'DELIVERED', rider: 1 },
        { date: d5, cust: 1, rest: 1, menuIndex: 4, qty: 2, status: 'DELIVERED', rider: 2 },
        { date: d5, cust: 2, rest: 2, menuIndex: 7, qty: 1, status: 'DELIVERED', rider: 0 },
        { date: d5, cust: 3, rest: 3, menuIndex: 9, qty: 2, status: 'DELIVERED', rider: 1 },

        { date: d4, cust: 4, rest: 0, menuIndex: 2, qty: 2, status: 'DELIVERED', rider: 2 },
        { date: d4, cust: 0, rest: 1, menuIndex: 5, qty: 1, status: 'DELIVERED', rider: 0 },
        { date: d4, cust: 1, rest: 2, menuIndex: 6, qty: 3, status: 'DELIVERED', rider: 1 },
        { date: d4, cust: 2, rest: 3, menuIndex: 8, qty: 1, status: 'DELIVERED', rider: 2 },

        { date: d3, cust: 3, rest: 0, menuIndex: 0, qty: 3, status: 'DELIVERED', rider: 0 },
        { date: d3, cust: 4, rest: 1, menuIndex: 3, qty: 2, status: 'DELIVERED', rider: 1 },
        { date: d3, cust: 0, rest: 2, menuIndex: 7, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d3, cust: 1, rest: 3, menuIndex: 9, qty: 1, status: 'DELIVERED', rider: 0 },

        { date: d2, cust: 2, rest: 0, menuIndex: 1, qty: 2, status: 'DELIVERED', rider: 1 },
        { date: d2, cust: 3, rest: 1, menuIndex: 4, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d2, cust: 4, rest: 2, menuIndex: 6, qty: 2, status: 'DELIVERED', rider: 0 },
        { date: d2, cust: 0, rest: 3, menuIndex: 8, qty: 2, status: 'DELIVERED', rider: 1 },

        { date: d1, cust: 1, rest: 0, menuIndex: 2, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d1, cust: 2, rest: 1, menuIndex: 5, qty: 2, status: 'DELIVERED', rider: 0 },
        { date: d1, cust: 3, rest: 2, menuIndex: 7, qty: 1, status: 'DELIVERED', rider: 1 },
        { date: d1, cust: 4, rest: 3, menuIndex: 9, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d1, cust: 0, rest: 1, menuIndex: 3, qty: 1, status: 'CANCELLED', rider: null },

        { date: d0, cust: 3, rest: 0, menuIndex: 0, qty: 3, status: 'DELIVERED', rider: 1 },
        { date: d0, cust: 2, rest: 0, menuIndex: 1, qty: 1, status: 'PICKED_UP', rider: 0 },
        { date: d0, cust: 4, rest: 0, menuIndex: 2, qty: 2, status: 'PENDING', rider: null },

        { date: d0, cust: 0, rest: 1, menuIndex: 4, qty: 2, status: 'DELIVERED', rider: 1, discount: 100, couponId: coupons[1].id }, // สมชายใช้คูปอง
        { date: d0, cust: 1, rest: 1, menuIndex: 3, qty: 1, status: 'PREPARING', rider: null },
        { date: d0, cust: 2, rest: 1, menuIndex: 5, qty: 1, status: 'CANCELLED', rider: null },

        { date: d0, cust: 1, rest: 2, menuIndex: 6, qty: 2, status: 'DELIVERED', rider: 2 },
        { date: d0, cust: 3, rest: 2, menuIndex: 7, qty: 1, status: 'READY_FOR_PICKUP', rider: 0 },

        { date: d0, cust: 2, rest: 3, menuIndex: 9, qty: 2, status: 'DELIVERED', rider: 0 },
        { date: d0, cust: 0, rest: 3, menuIndex: 8, qty: 1, status: 'PENDING', rider: null },
    ]

    for (const od of orderData) {
        const menu = allMenus[od.menuIndex]
        await prisma.order.create({
            data: {
                totalAmount: menu.price * od.qty,
                deliveryFee: 15.0,
                discountAmount: od.discount || 0,
                couponId: od.couponId || null,
                status: od.status as any,
                createdAt: od.date,
                customerId: customers[od.cust].id,
                restaurantId: allMenus[od.menuIndex].restaurantId,
                restaurantName: allMenus[od.menuIndex].restaurantName,
                riderId: od.rider !== null ? riders[od.rider].id : null,
                items: { create: [{ menuId: menu.id, quantity: od.qty, price: menu.price, imageUrl: menu.imageUrl }] }
            }
        })
    }

    console.log('✅ Master Seed V5 เสร็จสมบูรณ์! กราฟขึ้นสวยทุกร้านแน่นอน 📊🚀')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })