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
  ADMIN     // ผู้ดูแลระบบสูงสุด: เห็นทุกสาขา, จัดการทุกอย่างได้
  MANAGER   // ผู้จัดการสาขา: ดูแลเฉพาะสาขาตัวเอง, ดูรายงานได้
  STAFF     // พนักงานขาย: ขายสินค้า, ดูสต๊อกเบื้องต้น
}

enum TransactionType {
  SALE      // การขายสินค้า
  RESTOCK   // การรับสินค้าเข้าสต๊อก
  ADJUST    // การปรับปรุงสต๊อก (เช่น ของหาย, ชำรุด)
}

// ตารางผู้ใช้งาน
model User {
  id           String        @id @default(uuid())
  email        String        @unique
  password     String
  name         String
  role         Role          @default(STAFF)
  branchId     String?       // ถ้าเป็น Admin อาจจะเป็น null หรือเลือกสาขาที่ดูแลได้
  branch       Branch?       @relation(fields: [branchId], references: [id])
  transactions Transaction[] // รายกาลที่ user คนนี้ทำ
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

// ตารางสาขา
model Branch {
  id           String        @id @default(uuid())
  branchCode   String        @unique // รหัสสาขา เช่น BR001
  name         String        // ชื่อสาขา
  location     String?       // ที่อยู่/ตำแหน่ง
  users        User[]
  stocks       Stock[]
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

// ตารางหมวดหมู่สินค้า
model Category {
  id        String    @id @default(uuid())
  catCode   String    @unique // รหัสหมวดหมู่ เช่น CAT-001 (Auto-gen)
  name      String
  products  Product[]
}

// ตารางสินค้า (Master Data)
model Product {
  id               String            @id @default(uuid())
  sku              String            @unique // รหัสสินค้า เช่น PROD-0001 (Auto-gen)
  name             String
  description      String?
  imageUrl         String?
  unit             String            @default("ชิ้น") // หน่วยนับ เช่น ชิ้น, กล่อง
  basePrice        Decimal           @db.Decimal(10, 2)
  costPrice        Decimal           @db.Decimal(10, 2) @default(0) // ต้นทุน (Optional)
  categoryId       String
  category         Category          @relation(fields: [categoryId], references: [id])
  stocks           Stock[]
  transactionItems TransactionItem[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

// ตารางสต๊อกสินค้า (แยกตามสาขา)
model Stock {
  id        String  @id @default(uuid())
  branchId  String
  productId String
  quantity  Int     @default(0) // จำนวนคงเหลือ
  branch    Branch  @relation(fields: [branchId], references: [id])
  product   Product @relation(fields: [productId], references: [id])

  @@unique([branchId, productId]) // ป้องกันข้อมูลซ้ำ (1 สาขา มี 1 record ต่อ 1 สินค้า)
}

// ตารางรายการเคลื่อนไหว (Head)
model Transaction {
  id          String            @id @default(uuid())
  type        TransactionType
  branchId    String
  branch      Branch            @relation(fields: [branchId], references: [id])
  totalAmount Decimal           @db.Decimal(10, 2)
  items       TransactionItem[]
  createdById String
  createdBy   User              @relation(fields: [createdById], references: [id])
  note        String?           // หมายเหตุเพิ่มเติม
  createdAt   DateTime          @default(now())
}

// ตารางรายละเอียดรายการ (Detail)
model TransactionItem {
  id            String      @id @default(uuid())
  transactionId String
  transaction   Transaction @relation(fields: [transactionId], references: [id])
  productId     String
  product       Product     @relation(fields: [productId], references: [id])
  quantity      Int         // จำนวนที่ขาย/รับเข้า
  unitPrice     Decimal     @db.Decimal(10, 2) // ราคาต่อหน่วย ณ ตอนนั้น
  subtotal      Decimal     @db.Decimal(10, 2) // ราคารวม (quantity * unitPrice)
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

### Phase 3: Master Data Management

1. **Branch & Category**: สร้างหน้าเพิ่ม/ลบ สาขาและหมวดหมู่
2. **Product Management**:
   - หน้า List รายการสินค้า
   - หน้า Create/Edit Product พร้อม upload รูปภาพ
   - **Logic สำคัญ**: ระบบ **Auto-generate SKU**
     - Format: `CAT-001`, `PROD-0001`
     - Logic: Query `findFirst` order by `id` (หรือ sequence field) แล้วตัด string มา +1

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
