# 📋 Project Documentation: Multi-Branch Inventory & Sales Management (SP-System)

ระบบบริหารจัดการสต๊อกสินค้าและยอดขายแบบหลายสาขา พร้อมระบบแบ่งสิทธิ์ผู้ใช้งาน (RBAC)

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ (App Router), shadcn/ui, Tailwind CSS
- **Database**: PostgreSQL
- **ORM/Query Builder**:
  - **Prisma**: สำหรับจัดการ Schema และ Migrations
  - **Kysely**: สำหรับ Query ข้อมูลฝั่ง Backend (Type-safe SQL builder)
- **Auth**: Auth.js (NextAuth v5)
- **Language**: TypeScript

---

## 🗄 1. Database Schema Design (Prisma)

นี่คือโครงสร้าง Database ที่ออกแบบมาเพื่อรองรับ Multi-branch, Transactions และ RBAC ครับ
คุณสามารถนำไปวางใน `prisma/schema.prisma` ได้เลย

```prisma
generator client {
  provider = "prisma-client-js"
}

generator kysely {
  provider     = "prisma-kysely"
  output       = "../src/db"
  fileName     = "types.ts"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums สำหรับกำหนดค่าคงที่
enum Role {
  ADMIN
  MANAGER
  STAFF
}

enum TransactionType {
  SALE
  RESTOCK
  ADJUST
  TRANSFER
}

// ตารางผู้ใช้งาน
model User {
  id           String        @id @default(uuid())
  email        String        @unique
  password     String
  name         String
  role         Role          @default(STAFF)
  branchId     String?
  branch       Branch?       @relation(fields: [branchId], references: [id])
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

// ตารางสาขา
model Branch {
  id           String        @id @default(uuid())
  code         String        @unique // รหัสสาขา เช่น BR-001
  name         String
  location     String?
  users        User[]
  stocks       Stock[]
  transactions Transaction[] // รายการที่เกิดขึ้นที่สาขานี้
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

// ตารางหมวดหมู่สินค้า
model Category {
  id        String    @id @default(uuid())
  code      String    @unique // รหัสหมวดหมู่ เช่น CAT-001
  name      String
  products  Product[]
}

// ตารางสินค้า (Master Data)
model Product {
  id               String            @id @default(uuid())
  sku              String            @unique // รหัสสินค้า เช่น PROD-0001
  name             String
  description      String?
  imageUrl         String?
  unit             String            @default("ชิ้น")
  basePrice        Decimal           @db.Decimal(10, 2)
  costPrice        Decimal           @db.Decimal(10, 2) @default(0)
  categoryId       String
  category         Category          @relation(fields: [categoryId], references: [id])
  stocks           Stock[]
  transactionItems TransactionItem[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

// ตารางสต๊อกสินค้า
model Stock {
  id           String  @id @default(uuid())
  branchId     String
  productId    String
  quantity     Int     @default(0)
  reorderPoint Int     @default(10) // จุดสั่งซื้อเพิ่ม
  branch       Branch  @relation(fields: [branchId], references: [id])
  product      Product @relation(fields: [productId], references: [id])

  @@unique([branchId, productId])
}

// ตารางรายการเคลื่อนไหว (Head)
model Transaction {
  id          String            @id @default(uuid())
  type        TransactionType
  branchId    String // สาขาที่ทำรายการ
  branch      Branch            @relation(fields: [branchId], references: [id])
  totalAmount Decimal           @db.Decimal(10, 2)
  items       TransactionItem[]
  createdById String
  createdBy   User              @relation(fields: [createdById], references: [id])
  note        String?
  createdAt   DateTime          @default(now())
}

// ตารางรายละเอียดรายการ (Detail)
model TransactionItem {
  id            String      @id @default(uuid())
  transactionId String
  transaction   Transaction @relation(fields: [transactionId], references: [id])
  productId     String
  product       Product     @relation(fields: [productId], references: [id])
  quantity      Int
  unitPrice     Decimal     @db.Decimal(10, 2)
  subtotal      Decimal     @db.Decimal(10, 2)
}
```

---

## 🏗 2. Project Structure

โครงสร้างโฟลเดอร์ที่แนะนำเพื่อให้ง่ายต่อการขยายระบบ (Scalable)

```plaintext
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route Group สำหรับ Auth (Login)
│   │   └── login/
│   ├── (dashboard)/            # Route Group สำหรับหน้าหลัก (มี Sidebar/Layout)
│   │   ├── layout.tsx          # Dashboard Layout (Sidebar, Navbar)
│   │   ├── page.tsx            # หน้า Dashboard รวม (Summary)
│   │   ├── products/           # จัดการสินค้า (CRUD)
│   │   ├── inventory/          # จัดการสต๊อก (ดูของในสาขา, รับของเข้า)
│   │   ├── sales/              # บันทึกยอดขาย (POS หน้างาน)
│   │   ├── reports/            # รายงานละเอียด
│   │   └── settings/           # ตั้งค่าผู้ใช้/สาขา (Admin only)
│   └── api/                    # Route Handlers (ถ้าจำเป็นต้องมี API แยก)
│
├── components/
│   ├── ui/                     # shadcn/ui generic components
│   ├── layout/                 # MainNav, Sidebar, UserNav
│   ├── inventory/              # ProductTable, StockForm
│   ├── sales/                  # SaleCart, CheckoutCalculator
│   └── dashboard/              # OverviewCharts, RecentSales
│
├── lib/
│   ├── db.ts                   # Kysely connection config
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth configuration
│   └── utils.ts                # Helper functions (cn, formatters)
│
├── services/                   # Business Logic Layer (ใช้ Kysely ที่นี่)
│   ├── product.service.ts      # Logic สินค้า & SKU Gen
│   ├── stock.service.ts        # Logic ตัดสต๊อก/รับของ
│   └── report.service.ts       # Logic ดึงรายงาน Dashboard
│
└── types/                      # TypeScript definitions (generated from DB)
```

---

## 📅 3. Development Plan (Step-by-Step)

### Phase 1: Setup & Initialization

1. **Init Project**: `npx create-next-app@latest`
2. **Install Dependencies**: `shadcn-ui`, `prisma`, `kysely`, `pg`
3. **Setup Database**:
   - สร้าง PostgreSQL Database
   - เขียน `schema.prisma` ตามด้านบน
   - Run `npx prisma migrate dev --name init`

### Phase 2: Authentication & Layout (RBAC Core)

1. **Setup Auth.js**: เชื่อมต่อ Table `User`
2. **Create Layout**: สร้าง Sidebar navigation ที่แสดงเมนูตาม `User Role`
   - _Admin_: เห็นทุกเมนู
   - _MANAGER_: เห็นเฉพาะ Dashboard และ Report สาขาตัวเอง
   - _STAFF_: เห็นแค่ ขายสินค้า (Sales), ดูสต๊อก (Inventory)

### Phase 3: Master Data Management (Current Status: ✅ Database Integrated)

1. **Category Management**:
   - ✅ หน้าเพิ่ม/ลบ หมวดหมู่ (เชื่อมต่อ Mock Data)
2. **Product Management**:
   - ✅ หน้า List รายการสินค้า (Dynamic Table)
   - ✅ Create/Edit Product (Form Validation)
   - ✅ **Mock SKU Generation**: Auto-assign `SKU-TIMESTAMP` for now.

### Phase 4: Inventory & Branch Logic (Current Status: ✅ Database Integrated)

1. **Stock View**:
   - ✅ Filter by Branch (Dropdown)
   - ✅ View Stock per Product/Branch
2. **Stock Adjustment**:
   - ✅ Adjust Quantity (Set Stock)
   - ✅ Transfer Stock (HQ -> Branch) logic in DataContext

### Phase 4: Inventory & Sales (Core Features)

1. **Stock View**: ตารางดูจำนวนสินค้าคงเหลือ แยกตามสาขา (Filter by `branchId`)
2. **Restock (รับของเข้า)**:
   - เลือกสินค้า -> กรอกจำนวน -> Save (Transaction type `RESTOCK`)
   - ระบบ + จำนวนสินค้าเข้า `Stock.quantity`
3. **Sales Recording (ขายของ)**:
   - UI เลือกสินค้าใส่ตะกร้า (Cart)
   - ระบบคำนวณราคารวมอัตโนมัติ (Qty x Price)
   - กด Save (Transaction type `SALE`)
   - **Logic สำคัญ**:
     - Create `Transaction` header
     - Loop Create `TransactionItem` details
     - Update `Stock.quantity` (Decrease)

### Phase 5: Dashboard & Analytics

1. Query ข้อมูลด้วย **Kysely** เพื่อ Performance ที่ดี
2. **Widgets**:
   - **Total Sales**: Sum `totalAmount` where type = `SALE` filter by date (Today/Month)
   - **Low Stock Alert**: Query สินค้าที่ `quantity < 10` (แจ้งเตือนของใกล้หมด)
   - **Best Seller Category**: Pie Chart แสดงสัดส่วนยอดขายตามหมวดหมู่
   - **Branch Comparison**: Bar Chart เปรียบเทียบยอดขายแต่ละสาขา

---

## � Key Implementation Snippets

### ตัวอย่าง Logic การตัดสต๊อก (Transaction)

```typescript
// services/transaction.service.ts
import { db } from "@/lib/db"; // Kysely instance

export async function createSaleTransaction(data: CreateSaleDto) {
	return await db.transaction().execute(async (trx) => {
		// 1. สร้าง Transaction Head
		const transaction = await trx
			.insertInto("Transaction")
			.values({
				id: crypto.randomUUID(),
				type: "SALE",
				branchId: data.branchId,
				totalAmount: data.totalAmount,
				createdById: data.userId,
				// createdAt: new Date() // DB default
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		// 2. Loop สร้าง Items และตัดสต๊อก
		for (const item of data.items) {
			// 2.1 Insert Item Details
			await trx
				.insertInto("TransactionItem")
				.values({
					id: crypto.randomUUID(),
					transactionId: transaction.id,
					productId: item.productId,
					quantity: item.quantity,
					unitPrice: item.unitPrice, // ราคาสินค้า ณ ตอนที่ขาย
					subtotal: item.quantity * item.unitPrice,
				})
				.execute();

			// 2.2 Update Stock (Decrement)
			// ต้องมั่นใจว่าตัดจาก Branch เดียวกัน
			await trx
				.updateTable("Stock")
				.set((eb) => ({
					quantity: eb("quantity", "-", item.quantity),
				}))
				.where("branchId", "=", data.branchId)
				.where("productId", "=", item.productId)
				.execute();
		}

		return transaction;
	});
}
```
