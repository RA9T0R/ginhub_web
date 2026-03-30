# 🍔 GinHub: The Next-Gen Food Delivery Ecosystem

GinHub is a full-stack, comprehensive food delivery platform designed to seamlessly connect hungry customers, local restaurants, and delivery riders. Built with a strong emphasis on User Experience (UX) and Real-time Business Logic, the platform ensures an optimized ordering flow, preventing common delivery pitfalls like abandoned orders or unavailable drivers.
## ✨ Key Features

* **Role-Based Access Control (RBAC):** Three distinct user experiences and dashboards for Customers, Restaurants, and Riders.
* **Real-Time Availability Toggle:** Restaurants and Riders can switch their status (Online/Offline) instantly.
* **Smart Order Routing & Prevention:** The system actively checks for online riders. If no riders are available, the checkout is intelligently disabled to prevent customer frustration.
* **Dynamic UI Rendering:** Offline restaurants are automatically grayed out (grayscale) and pushed to the bottom of the list with a "Closed" badge.
* **Smart Cart & Coupon System:** Client-side cart state management with real-time discount calculations (Percentage & Fixed amounts) and a daily randomized gift box system.

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js (App Router) + Tailwind CSS |
| **Backend** | Next.js Server Actions & API Routes |
| **Database ORM** | Prisma |
| **Database & Storage** | SQLite |
| **Authentication** | NextAuth.js |
| **State Management** | Zustand |

## 🧠 Core Business Logic (The Smart Flow)

GinHub handles edge cases that standard tutorial apps miss. Here is how the core ecosystem functions:
1. **Restaurant Status:** If a restaurant toggles "Offline", the database immediately reflects this. The Customer UI dynamically applies a grayscale filter, disables the menu, and actively prevents new orders.
2. **Rider Availability:** During checkout, the server queries the `DeliveryPersonnel` table for `isOnline == true`. If the length is `0`, the transaction is aborted with a warning toast. If available, the order is randomly assigned to an active rider.
3. **The Promotional Engine:** The daily coupon system checks the `createdAt` timestamp against the start of the current day. If verified, it uses a weighted randomization algorithm to drop a coupon (e.g., 50% chance for Free Delivery, 15% for 20% Discount).

## 🚀 Getting Started
To run the full application stack locally with the "Master Seed V6" demo data:

### 1. Prerequisites
* Node.js (v18+) & npm
* Git

### 2. Environment Variables
Create a `.env` file in the root directory and add the following:

```env
# Database Configuration (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your_super_secret_key_for_jwt_encryption_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Setup & Database Seeding
Install dependencies and generate the Prisma Client:

```bash
npm install
npx prisma generate
```

Initialize the database and inject the Master Seed V6 (Includes 5 restaurants, 25 menus, 3 riders, and historical order data for graphs):

```bash
npx prisma db push --force-reset
npx prisma db seed
```

### 4. Run the Application
Start the Next.js development server:
```bash
npm run dev
```
* **The application will be accessible at** `http://localhost:3000`
