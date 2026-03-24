import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 กำลังเริ่มสร้างข้อมูลจำลองชุดใหญ่ (Master Seed V6 - Demo Edition)...')

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
    // 2. สร้างบัญชีผู้ใช้หลัก (Users) - เพิ่ม owner5
    // ----------------------------------------------------
    console.log('  - สร้างบัญชีผู้ใช้...')
    const userPool = await Promise.all([
        prisma.user.create({ data: { name: 'เฮียหมู', email: 'owner1@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'เจ๊จู', email: 'owner2@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'บังซา', email: 'owner3@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'เชฟโทยะ', email: 'owner4@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'แม่นุ่น เบเกอรี่', email: 'owner5@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }), // ร้านที่ 5

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
        prisma.customer.create({ data: { userId: userPool[5].id, address: '123 ซอยสุขุมวิท 10, กรุงเทพ', phone: '081-234-5678' } }),
        prisma.customer.create({ data: { userId: userPool[6].id, address: 'คอนโด A ชั้น 15, พระราม 9', phone: '089-876-5432' } }),
        prisma.customer.create({ data: { userId: userPool[7].id, address: 'หอพักหน้ามหาวิทยาลัย, นนทบุรี', phone: '085-555-4444' } }),
        prisma.customer.create({ data: { userId: userPool[8].id, address: 'หมู่บ้านเศรษฐี, บางนา', phone: '082-222-3333' } }),
        prisma.customer.create({ data: { userId: userPool[9].id, address: 'อพาร์ทเมนท์ B, ลาดพร้าว', phone: '083-333-4444' } }),
    ])

    const riders = await Promise.all([
        prisma.deliveryPersonnel.create({ data: { userId: userPool[10].id, phone: '091-111-1111', licensePlate: '1กข 1234', balance: 1450.0, driverScore: 98.5 } }),
        prisma.deliveryPersonnel.create({ data: { userId: userPool[11].id, phone: '092-222-2222', licensePlate: '2คง 5678', balance: 520.0, driverScore: 92.0 } }),
        prisma.deliveryPersonnel.create({ data: { userId: userPool[12].id, phone: '093-333-3333', licensePlate: '3จฉ 9012', balance: 890.0, driverScore: 99.9 } }),
    ])

    // ----------------------------------------------------
    // 4. สร้างร้านอาหาร (5 ร้าน)
    // ----------------------------------------------------
    console.log('  - สร้างร้านอาหาร...')
    const rest1 = await prisma.restaurant.create({ data: { name: 'ข้าวมันไก่เฮียหมู (เจ้าเก่า)', category: 'ตามสั่ง', description: 'ไก่ตอนเนื้อนุ่ม ข้าวมันหอมกรุ่น น้ำจิ้มรสเด็ด', imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80', ownerId: userPool[0].id, rating: 4.8, isOnline: true } })
    const rest2 = await prisma.restaurant.create({ data: { name: 'เจ๊จู ผัดกะเพราพริกแห้ง', category: 'ตามสั่ง', description: 'กะเพราแท้ไม่ใส่ถั่วฝักยาว เผ็ดร้อนถึงใจ', imageUrl: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=800&q=80', ownerId: userPool[1].id, rating: 4.5, isOnline: true } })
    const rest3 = await prisma.restaurant.create({ data: { name: 'บังซา ข้าวหมกไก่', category: 'ทั่วไป', description: 'อาหารฮาลาลแท้ ต้นตำรับจากยะลา', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', ownerId: userPool[2].id, rating: 4.7, isOnline: true } })
    const rest4 = await prisma.restaurant.create({ data: { name: 'Toya Sushi Premium', category: 'ทั่วไป', description: 'ซูชิพรีเมียม วัตถุดิบส่งตรงจากโอซาก้า', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', ownerId: userPool[3].id, rating: 4.9, isOnline: true } })
    const rest5 = await prisma.restaurant.create({ data: { name: 'Sweet Time คาเฟ่ & เบเกอรี่', category: 'ของหวาน', description: 'ขนมเค้กและเครื่องดื่มโฮมเมด ทำสดใหม่ทุกวัน', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80', ownerId: userPool[4].id, rating: 4.6, isOnline: true } })

    // ----------------------------------------------------
    // 5. สร้างเมนู (ร้านละ 5 เมนู = 25 เมนู)
    // ----------------------------------------------------
    console.log('  - สร้างเมนูอาหาร...')
    const menuData = [
        // ร้านที่ 1: ข้าวมันไก่
        { name: 'ข้าวมันไก่ต้ม (ธรรมดา)', price: 50, restaurantId: rest1.id, restaurantName: rest1.name, imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&q=80' },
        { name: 'ข้าวมันไก่ทอด', price: 55, restaurantId: rest1.id, restaurantName: rest1.name, imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?w=500&q=80' },
        { name: 'ข้าวมันไก่ผสม', price: 65, restaurantId: rest1.id, restaurantName: rest1.name, imageUrl: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=500&q=80' },
        { name: 'ไก่สับ (จานเล็ก)', price: 100, restaurantId: rest1.id, restaurantName: rest1.name, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80' },
        { name: 'ซุปกระดูกหมูตุ๋นยาจีน', price: 40, restaurantId: rest1.id, restaurantName: rest1.name, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80' },

        // ร้านที่ 2: กะเพรา
        { name: 'กะเพราหมูสับไข่ดาว', price: 60, restaurantId: rest2.id, restaurantName: rest2.name, imageUrl: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=500&q=80' },
        { name: 'กะเพราหมูกรอบไข่ดาว', price: 70, restaurantId: rest2.id, restaurantName: rest2.name, imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&q=80' },
        { name: 'กะเพราเนื้อโคขุน', price: 85, restaurantId: rest2.id, restaurantName: rest2.name, imageUrl: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=500&q=80' },
        { name: 'กะเพราทะเลรวม', price: 95, restaurantId: rest2.id, restaurantName: rest2.name, imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500&q=80' },
        { name: 'ข้าวผัดต้มยำกุ้ง', price: 80, restaurantId: rest2.id, restaurantName: rest2.name, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80' },

        // ร้านที่ 3: ข้าวหมกไก่
        { name: 'ข้าวหมกไก่', price: 60, restaurantId: rest3.id, restaurantName: rest3.name, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
        { name: 'ข้าวหมกเนื้อ', price: 85, restaurantId: rest3.id, restaurantName: rest3.name, imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&q=80' },
        { name: 'ซุปหางวัว', price: 120, restaurantId: rest3.id, restaurantName: rest3.name, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80' },
        { name: 'ซุปไก่', price: 60, restaurantId: rest3.id, restaurantName: rest3.name, imageUrl: 'https://images.unsplash.com/photo-1606850780554-b55ea40f0b70?w=500&q=80' },
        { name: 'สลัดแขก', price: 50, restaurantId: rest3.id, restaurantName: rest3.name, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },

        // ร้านที่ 4: ซูชิ
        { name: 'Salmon Set (แซลมอนเซ็ต)', price: 299, restaurantId: rest4.id, restaurantName: rest4.name, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80' },
        { name: 'Unagi Don (ข้าวหน้าปลาไหล)', price: 350, restaurantId: rest4.id, restaurantName: rest4.name, imageUrl: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&q=80' },
        { name: 'California Roll', price: 150, restaurantId: rest4.id, restaurantName: rest4.name, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
        { name: 'Sashimi รวม', price: 450, restaurantId: rest4.id, restaurantName: rest4.name, imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80' },
        { name: 'Ebi Tempura (กุ้งเทมปุระ)', price: 120, restaurantId: rest4.id, restaurantName: rest4.name, imageUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=500&q=80' },

        // ร้านที่ 5: คาเฟ่
        { name: 'Strawberry Shortcake', price: 120, restaurantId: rest5.id, restaurantName: rest5.name, imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80' },
        { name: 'Fluffy Pancake', price: 145, restaurantId: rest5.id, restaurantName: rest5.name, imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&q=80' },
        { name: 'Chocolate Cupcake', price: 65, restaurantId: rest5.id, restaurantName: rest5.name, imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80' },
        { name: 'Iced Americano', price: 60, restaurantId: rest5.id, restaurantName: rest5.name, imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&q=80' },
        { name: 'ชานมไข่มุก', price: 55, restaurantId: rest5.id, restaurantName: rest5.name, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80' },
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
        prisma.coupon.create({
            data: {
                customerId: customers[0].id, code: 'GINHUB20', description: 'ลดค่าอาหาร 20%', discountType: 'PERCENTAGE', discountValue: 20, isUsed: false, expiresAt: futureDate,
                createdAt: d1
            }
        }),
        prisma.coupon.create({
            data: {
                customerId: customers[0].id, code: 'WELCOME100', description: 'ลด 100 บาท', discountType: 'FIXED', discountValue: 100, isUsed: true, expiresAt: futureDate,
                createdAt: d2
            }
        }),
    ])

    // ----------------------------------------------------
    // 7. สร้างประวัติคำสั่งซื้อแบบกระจายให้ครบ 5 ร้าน
    // ----------------------------------------------------
    console.log('  - อัดประวัติคำสั่งซื้อย้อนหลัง 7 วันให้ทุกร้าน...')

    const orderData = [
        // วันที่ 6 ย้อนหลัง
        { date: d6, cust: 1, rest: 0, menuIndex: 0, qty: 2, status: 'DELIVERED', rider: 0 },
        { date: d6, cust: 2, rest: 1, menuIndex: 5, qty: 1, status: 'DELIVERED', rider: 1 },
        { date: d6, cust: 3, rest: 2, menuIndex: 10, qty: 2, status: 'DELIVERED', rider: 2 },
        { date: d6, cust: 4, rest: 3, menuIndex: 15, qty: 1, status: 'DELIVERED', rider: 0 },
        { date: d6, cust: 0, rest: 4, menuIndex: 20, qty: 2, status: 'DELIVERED', rider: 1 }, // ร้านใหม่

        // วันที่ 5 ย้อนหลัง
        { date: d5, cust: 0, rest: 0, menuIndex: 1, qty: 1, status: 'DELIVERED', rider: 1 },
        { date: d5, cust: 1, rest: 1, menuIndex: 6, qty: 2, status: 'DELIVERED', rider: 2 },
        { date: d5, cust: 2, rest: 2, menuIndex: 11, qty: 1, status: 'DELIVERED', rider: 0 },
        { date: d5, cust: 3, rest: 4, menuIndex: 23, qty: 3, status: 'DELIVERED', rider: 1 }, // ร้านใหม่

        // วันที่ 4 ย้อนหลัง
        { date: d4, cust: 4, rest: 0, menuIndex: 2, qty: 2, status: 'DELIVERED', rider: 2 },
        { date: d4, cust: 0, rest: 1, menuIndex: 7, qty: 1, status: 'DELIVERED', rider: 0 },
        { date: d4, cust: 1, rest: 2, menuIndex: 12, qty: 3, status: 'DELIVERED', rider: 1 },
        { date: d4, cust: 2, rest: 3, menuIndex: 16, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d4, cust: 3, rest: 4, menuIndex: 21, qty: 2, status: 'DELIVERED', rider: 0 }, // ร้านใหม่

        // วันที่ 3 ย้อนหลัง
        { date: d3, cust: 3, rest: 0, menuIndex: 0, qty: 3, status: 'DELIVERED', rider: 0 },
        { date: d3, cust: 4, rest: 1, menuIndex: 8, qty: 2, status: 'DELIVERED', rider: 1 },
        { date: d3, cust: 0, rest: 2, menuIndex: 13, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d3, cust: 1, rest: 3, menuIndex: 17, qty: 1, status: 'DELIVERED', rider: 0 },
        { date: d3, cust: 2, rest: 4, menuIndex: 24, qty: 4, status: 'DELIVERED', rider: 1 }, // ร้านใหม่

        // วันที่ 2 ย้อนหลัง
        { date: d2, cust: 2, rest: 0, menuIndex: 3, qty: 2, status: 'DELIVERED', rider: 1 },
        { date: d2, cust: 3, rest: 1, menuIndex: 9, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d2, cust: 4, rest: 2, menuIndex: 14, qty: 2, status: 'DELIVERED', rider: 0 },
        { date: d2, cust: 0, rest: 3, menuIndex: 18, qty: 2, status: 'DELIVERED', rider: 1 },

        // วันที่ 1 ย้อนหลัง
        { date: d1, cust: 1, rest: 0, menuIndex: 4, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d1, cust: 2, rest: 1, menuIndex: 5, qty: 2, status: 'DELIVERED', rider: 0 },
        { date: d1, cust: 3, rest: 4, menuIndex: 20, qty: 1, status: 'DELIVERED', rider: 1 }, // ร้านใหม่
        { date: d1, cust: 4, rest: 3, menuIndex: 19, qty: 1, status: 'DELIVERED', rider: 2 },
        { date: d1, cust: 0, rest: 1, menuIndex: 6, qty: 1, status: 'CANCELLED', rider: null },

        // วันนี้ (สถานะผสม)
        { date: d0, cust: 3, rest: 0, menuIndex: 0, qty: 3, status: 'DELIVERED', rider: 1 },
        { date: d0, cust: 2, rest: 0, menuIndex: 1, qty: 1, status: 'PICKED_UP', rider: 0 },
        { date: d0, cust: 4, rest: 0, menuIndex: 2, qty: 2, status: 'PENDING', rider: null },

        { date: d0, cust: 0, rest: 1, menuIndex: 5, qty: 2, status: 'DELIVERED', rider: 1, discount: 100, couponId: coupons[1].id }, // สมชายใช้คูปอง
        { date: d0, cust: 1, rest: 1, menuIndex: 7, qty: 1, status: 'PREPARING', rider: null },
        { date: d0, cust: 2, rest: 1, menuIndex: 8, qty: 1, status: 'CANCELLED', rider: null },

        { date: d0, cust: 1, rest: 2, menuIndex: 10, qty: 2, status: 'DELIVERED', rider: 2 },
        { date: d0, cust: 3, rest: 2, menuIndex: 11, qty: 1, status: 'READY_FOR_PICKUP', rider: 0 },

        { date: d0, cust: 2, rest: 3, menuIndex: 15, qty: 2, status: 'DELIVERED', rider: 0 },
        { date: d0, cust: 0, rest: 4, menuIndex: 22, qty: 2, status: 'PENDING', rider: null }, // ร้านใหม่ มีออร์เดอร์ค้าง
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

    console.log('✅ Master Seed V6 (Demo Edition) เสร็จสมบูรณ์! ข้อมูลสวยพร้อมพรีเซนต์ 📊🚀')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })