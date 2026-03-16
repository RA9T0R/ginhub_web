import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 กำลังเริ่มสร้างข้อมูลจำลองชุดใหญ่ (Master Seed - Normalized)...')

    // 1. ล้างข้อมูลเก่า (ย้อนลำดับความสัมพันธ์)
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.menu.deleteMany()
    await prisma.restaurant.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.deliveryPersonnel.deleteMany()
    await prisma.user.deleteMany()

    const hashedPassword = await bcrypt.hash('password123', 10)

    // 2. สร้างบัญชีผู้ใช้หลัก (Users)
    console.log('  - สร้างบัญชีผู้ใช้...')
    const userPool = await Promise.all([
        // Owners
        prisma.user.create({ data: { name: 'เฮียหมู', email: 'owner1@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'เจ๊จู', email: 'owner2@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'บังซา', email: 'owner3@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'เชฟโทยะ', email: 'owner4@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),

        // Customers
        prisma.user.create({ data: { name: 'สมชาย สายกิน', email: 'somchai@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
        prisma.user.create({ data: { name: 'สมหญิง รักสุขภาพ', email: 'somying@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
        prisma.user.create({ data: { name: 'จอห์น ชาวไร่', email: 'john@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),

        // Riders
        prisma.user.create({ data: { name: 'พี่วิน บิดมิดไมล์', email: 'rider1@ginhub.com', password: hashedPassword, role: 'DELIVERY' } }),
        prisma.user.create({ data: { name: 'น้องบอย สายซิ่ง', email: 'rider2@ginhub.com', password: hashedPassword, role: 'DELIVERY' } }),
    ])

    // 3. สร้าง Profile ย่อย (Customer & DeliveryPersonnel)
    console.log('  - สร้างโปรไฟล์ย่อย...')
    const customers = await Promise.all([
        prisma.customer.create({ data: { userId: userPool[4].id, address: '123 ซอยสุขุมวิท 10, กรุงเทพ', phone: '081-234-5678' } }),
        prisma.customer.create({ data: { userId: userPool[5].id, address: 'คอนโด A ชั้น 15, พระราม 9', phone: '089-876-5432' } }),
        prisma.customer.create({ data: { userId: userPool[6].id, address: 'หอพักหน้ามหาวิทยาลัย, นนทบุรี', phone: '085-555-4444' } }),
    ])

    const riders = await Promise.all([
        prisma.deliveryPersonnel.create({ data: { userId: userPool[7].id, phone: '091-111-1111', licensePlate: '1กข 1234', balance: 450.0, driverScore: 98.5 } }),
        prisma.deliveryPersonnel.create({ data: { userId: userPool[8].id, phone: '092-222-2222', licensePlate: '2คง 5678', balance: 120.0, driverScore: 92.0 } }),
    ])

    // 4. สร้างร้านอาหาร (Restaurants)
    console.log('  - สร้างร้านอาหาร...')
    const restaurants = await Promise.all([
        prisma.restaurant.create({
            data: {
                name: 'ข้าวมันไก่เฮียหมู (เจ้าเก่า)', category: 'ตามสั่ง', description: 'ไก่ตอนเนื้อนุ่ม ข้าวมันหอมกรุ่น น้ำจิ้มรสเด็ด',
                imageUrl: 'https://images.unsplash.com/photo-1626804475297-4160ebea0364?w=800&q=80', ownerId: userPool[0].id, rating: 4.8
            }
        }),
        prisma.restaurant.create({
            data: {
                name: 'เจ๊จู ผัดกะเพราพริกแห้ง', category: 'ตามสั่ง', description: 'กะเพราแท้ไม่ใส่ถั่วฝักยาว เผ็ดร้อนถึงใจ',
                imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', ownerId: userPool[1].id, rating: 4.5
            }
        }),
        prisma.restaurant.create({
            data: {
                name: 'บังซา ข้าวหมกไก่', category: 'ทั่วไป', description: 'อาหารฮาลาลแท้ ต้นตำรับจากยะลา',
                imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', ownerId: userPool[2].id, rating: 4.7
            }
        }),
        prisma.restaurant.create({
            data: {
                name: 'Toya Sushi', category: 'ทั่วไป', description: 'ซูชิพรีเมียม วัตถุดิบส่งตรงจากญี่ปุ่น',
                imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', ownerId: userPool[3].id, rating: 4.9
            }
        }),
    ])

    // 5. สร้างเมนู (Menus)
    console.log('  - สร้างเมนู...')
    const menuData = [
        { name: 'ข้าวมันไก่ต้ม (ธรรมดา)', price: 50, restaurantId: restaurants[0].id, restaurantName: restaurants[0].name, imageUrl: 'https://images.unsplash.com/photo-1626804475297-4160ebea0364?w=500&q=80' },
        { name: 'ข้าวมันไก่ผสม (ต้ม+ทอด)', price: 65, restaurantId: restaurants[0].id, restaurantName: restaurants[0].name, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80' },
        { name: 'กะเพราหมูสับไข่ดาว', price: 60, restaurantId: restaurants[1].id, restaurantName: restaurants[1].name, imageUrl: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=500&q=80' },
        { name: 'กะเพราเนื้อโคขุน', price: 85, restaurantId: restaurants[1].id, restaurantName: restaurants[1].name, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80' },
        { name: 'ข้าวหมกไก่ทอด', price: 60, restaurantId: restaurants[2].id, restaurantName: restaurants[2].name, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80' },
        { name: 'ซุปหางวัว', price: 120, restaurantId: restaurants[2].id, restaurantName: restaurants[2].name, imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80' },
        { name: 'Salmon Set', price: 299, restaurantId: restaurants[3].id, restaurantName: restaurants[3].name, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80' },
    ]

    for (const menu of menuData) {
        await prisma.menu.create({ data: menu })
    }

    const allMenus = await prisma.menu.findMany()

    // 6. สร้างประวัติคำสั่งซื้อ (Orders) ครอบคลุมทุก Tabs
    console.log('  - สร้างรายการคำสั่งซื้อจำลอง...')

    // ออร์เดอร์ 1: ส่งสำเร็จแล้ว (Completed)
    const order1 = await prisma.order.create({
        data: {
            totalAmount: 115.0, deliveryFee: 15.0, status: 'DELIVERED', orderRating: 5,
            customerId: customers[0].id, restaurantId: restaurants[0].id, restaurantName: restaurants[0].name,
            riderId: riders[0].id,
            items: { create: [{ menuId: allMenus[0].id, quantity: 2, price: 50.0, imageUrl: allMenus[0].imageUrl }] }
        }
    })

    // ออร์เดอร์ 2: กำลังเตรียมอาหาร (Ongoing - Restaurant)
    await prisma.order.create({
        data: {
            totalAmount: 60.0, deliveryFee: 15.0, status: 'PREPARING',
            customerId: customers[1].id, restaurantId: restaurants[1].id, restaurantName: restaurants[1].name,
            riderId: riders[1].id,
            items: { create: [{ menuId: allMenus[2].id, quantity: 1, price: 60.0, imageUrl: allMenus[2].imageUrl }] }
        }
    })

    // ออร์เดอร์ 3: รอไรเดอร์มารับ (Ongoing - Rider)
    await prisma.order.create({
        data: {
            totalAmount: 299.0, deliveryFee: 20.0, status: 'READY_FOR_PICKUP',
            customerId: customers[2].id, restaurantId: restaurants[3].id, restaurantName: restaurants[3].name,
            riderId: riders[0].id,
            items: { create: [{ menuId: allMenus[6].id, quantity: 1, price: 299.0, imageUrl: allMenus[6].imageUrl }] }
        }
    })

    // ออร์เดอร์ 4: ยกเลิก (Cancelled)
    await prisma.order.create({
        data: {
            totalAmount: 120.0, deliveryFee: 15.0, status: 'CANCELLED',
            customerId: customers[0].id, restaurantId: restaurants[2].id, restaurantName: restaurants[2].name,
            items: { create: [{ menuId: allMenus[5].id, quantity: 1, price: 120.0, imageUrl: allMenus[5].imageUrl }] }
        }
    })

    // ออร์เดอร์ 5: ไรเดอร์กำลังไปส่ง (Ongoing)
    await prisma.order.create({
        data: {
            totalAmount: 120.0, deliveryFee: 15.0, status: 'PICKED_UP',
            customerId: customers[1].id, restaurantId: restaurants[1].id, restaurantName: restaurants[1].name,
            riderId: riders[1].id,
            items: { create: [{ menuId: allMenus[3].id, quantity: 1, price: 85.0, imageUrl: allMenus[3].imageUrl }] }
        }
    })

    console.log('✅ Master Seed เสร็จสิ้น! ระบบพร้อมสำหรับการทดสอบทุก Role แล้วครับ')
    console.log('--------------------------------------------------')
    console.log('Credentials (Password: password123):')
    console.log('  - ลูกค้า: somchai@customer.com, somying@customer.com')
    console.log('  - ร้านค้า: owner1@ginhub.com (เฮียหมู), owner2@ginhub.com (เจ๊จู)')
    console.log('  - ไรเดอร์: rider1@ginhub.com (พี่วิน), rider2@ginhub.com (น้องบอย)')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })