import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 กำลังเริ่มสร้างข้อมูลจำลอง (Seeding Data)...')

    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.menu.deleteMany()
    await prisma.restaurant.deleteMany()
    await prisma.user.deleteMany()

    const hashedPassword = await bcrypt.hash('password123', 10)

    const owners = await Promise.all([
        prisma.user.create({ data: { name: 'เฮียหมู', email: 'owner1@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'เจ๊จู', email: 'owner2@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'ลุงบ๊อบ', email: 'owner3@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'ป้าศรี', email: 'owner4@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
        prisma.user.create({ data: { name: 'น้องหวาน', email: 'owner5@ginhub.com', password: hashedPassword, role: 'RESTAURANT' } }),
    ])

    const customers = await Promise.all([
        prisma.user.create({ data: { name: 'สมชาย สายกิน', email: 'somchai@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
        prisma.user.create({ data: { name: 'สมหญิง รักสุขภาพ', email: 'somying@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
        prisma.user.create({ data: { name: 'จอห์น หิวบ่อย', email: 'john@customer.com', password: hashedPassword, role: 'CUSTOMER' } }),
    ])

    const restaurants = await Promise.all([
        prisma.restaurant.create({
            data: {
                name: 'ร้านข้าวมันไก่ เฮียหมู', category: 'ฟาสต์ฟู้ด', description: 'ข้าวมันไก่สูตรไหหลำ เนื้อนุ่ม น้ำจิ้มรสเด็ด',
                imageUrl: 'https://images.unsplash.com/photo-1626804475297-4160ebea0364?w=800&q=80', ownerId: owners[0].id,
            }
        }),
        prisma.restaurant.create({
            data: {
                name: 'เจ๊จู อาหารตามสั่ง', category: 'ตามสั่ง', description: 'ผัดกะเพรารสจัดจ้าน ให้เยอะ อิ่มคุ้ม',
                imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', ownerId: owners[1].id,
            }
        }),
        prisma.restaurant.create({
            data: {
                name: 'เบอร์เกอร์ ลุงบ๊อบ', category: 'ฟาสต์ฟู้ด', description: 'เบอร์เกอร์โฮมเมด เนื้อฉ่ำๆ ชิ้นโต',
                imageUrl: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&q=80', ownerId: owners[2].id,
            }
        }),
        prisma.restaurant.create({
            data: {
                name: 'ก๋วยเตี๋ยวเรือ ป้าศรี', category: 'ก๋วยเตี๋ยว', description: 'น้ำตกเข้มข้น พริกคั่วหอมๆ หมูนุ่มลวกจิ้ม',
                imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80', ownerId: owners[3].id,
            }
        }),
        prisma.restaurant.create({
            data: {
                name: 'คาเฟ่ เดอ หวาน', category: 'ของหวาน', description: 'เค้ก บิงซู และเครื่องดื่มชื่นใจ',
                imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80', ownerId: owners[4].id,
            }
        }),
    ])

    await prisma.menu.createMany({
        data: [
            { name: 'ข้าวมันไก่ต้ม', price: 50, imageUrl: 'https://images.unsplash.com/photo-1626804475297-4160ebea0364?w=500&q=80', restaurantId: restaurants[0].id, restaurantName: restaurants[0].name },
            { name: 'ข้าวมันไก่ทอด', price: 55, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80', restaurantId: restaurants[0].id, restaurantName: restaurants[0].name },
            { name: 'ไก่สับจานเล็ก', price: 80, imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500&q=80', restaurantId: restaurants[0].id, restaurantName: restaurants[0].name },

            { name: 'ข้าวกะเพราหมูสับไข่ดาว', price: 60, imageUrl: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=500&q=80', restaurantId: restaurants[1].id, restaurantName: restaurants[1].name },
            { name: 'ข้าวผัดต้มยำทะเล', price: 70, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80', restaurantId: restaurants[1].id, restaurantName: restaurants[1].name },
            { name: 'ข้าวหมูกระเทียม', price: 50, imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80', restaurantId: restaurants[1].id, restaurantName: restaurants[1].name },

            { name: 'ชีสเบอร์เกอร์เนื้อ', price: 120, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', restaurantId: restaurants[2].id, restaurantName: restaurants[2].name },
            { name: 'เฟรนช์ฟรายส์', price: 45, imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80', restaurantId: restaurants[2].id, restaurantName: restaurants[2].name },

            { name: 'เส้นเล็กน้ำตกหมู', price: 40, imageUrl: 'https://images.unsplash.com/photo-1569422557497-2178dcebce5c?w=500&q=80', restaurantId: restaurants[3].id, restaurantName: restaurants[3].name },
            { name: 'บะหมี่แห้งต้มยำ', price: 45, imageUrl: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=500&q=80', restaurantId: restaurants[3].id, restaurantName: restaurants[3].name },

            { name: 'สตรอว์เบอร์รีชีสเค้ก', price: 95, imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80', restaurantId: restaurants[4].id, restaurantName: restaurants[4].name },
            { name: 'ชาเขียวมัทฉะเย็น', price: 65, imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&q=80', restaurantId: restaurants[4].id, restaurantName: restaurants[4].name },
        ],
    })

    const allMenus = await prisma.menu.findMany()

    const menu1 = allMenus.find(m => m.name === 'ข้าวกะเพราหมูสับไข่ดาว')
    if (menu1) {
        await prisma.order.create({
            data: {
                totalAmount: menu1.price * 2, status: 'DELIVERED', customerId: customers[0].id, restaurantId: restaurants[1].id, restaurantName: restaurants[1].name,
                items: { create: [{ menuId: menu1.id, quantity: 2, price: menu1.price, imageUrl: menu1.imageUrl }] },
            },
        })
    }

    const menu2 = allMenus.find(m => m.name === 'ข้าวมันไก่ทอด')
    if (menu2) {
        await prisma.order.create({
            data: {
                totalAmount: menu2.price * 1, status: 'PREPARING', customerId: customers[1].id, restaurantId: restaurants[0].id, restaurantName: restaurants[0].name,
                items: { create: [{ menuId: menu2.id, quantity: 1, price: menu2.price, imageUrl: menu2.imageUrl }] },
            },
        })
    }

    const menu3 = allMenus.find(m => m.name === 'ชีสเบอร์เกอร์เนื้อ')
    const menu4 = allMenus.find(m => m.name === 'เฟรนช์ฟรายส์')
    if (menu3 && menu4) {
        await prisma.order.create({
            data: {
                totalAmount: menu3.price + menu4.price, status: 'PENDING', customerId: customers[2].id, restaurantId: restaurants[2].id, restaurantName: restaurants[2].name,
                items: {
                    create: [
                        { menuId: menu3.id, quantity: 1, price: menu3.price, imageUrl: menu3.imageUrl },
                        { menuId: menu4.id, quantity: 1, price: menu4.price, imageUrl: menu4.imageUrl },
                    ]
                },
            },
        })
    }

    const menu5 = allMenus.find(m => m.name === 'สตรอว์เบอร์รีชีสเค้ก')
    if (menu5) {
        await prisma.order.create({
            data: {
                totalAmount: menu5.price * 3, status: 'DELIVERED', customerId: customers[0].id, restaurantId: restaurants[4].id, restaurantName: restaurants[4].name,
                items: { create: [{ menuId: menu5.id, quantity: 3, price: menu5.price, imageUrl: menu5.imageUrl }] },
            },
        })
    }

    console.log('✅ สร้างข้อมูลจำลองชุดใหญ่เสร็จสมบูรณ์!')
    console.log('-----------------------------------')
    console.log('ข้อมูลเข้าสู่ระบบ (รหัสผ่านคือ password123 ทั้งหมด):')
    console.log('🧑‍🍳 ร้านค้า:')
    console.log('  - owner1@ginhub.com (เฮียหมู)')
    console.log('  - owner2@ginhub.com (เจ๊จู)')
    console.log('  - owner3@ginhub.com (ลุงบ๊อบ)')
    console.log('  - owner4@ginhub.com (ป้าศรี)')
    console.log('  - owner5@ginhub.com (น้องหวาน)')
    console.log('🧑‍💼 ลูกค้า:')
    console.log('  - somchai@customer.com (สมชาย)')
    console.log('  - somying@customer.com (สมหญิง)')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })