# SP System (ระบบจัดการสต๊อกและขายหน้าร้าน)

![Build Status](https://github.com/tackle063444/tackle063444.github.io/actions/workflows/deploy.yml/badge.svg)

ระบบบริหารจัดการสินค้าคงคลัง (Inventory Management) และระบบขายหน้าร้าน (POS) ที่ออกแบบมาเพื่อรองรับการทำงานหลายสาขา (Multi-branch) พร้อมระบบรายงานผลแบบ Real-time

![SP System Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop)

## ✨ ฟีเจอร์หลัก (Features)

- **🖥️ Dashboard & Analytics**: ภาพรวมยอดขาย, กำไร, และสินค้าคงเหลือ แสดงผลด้วยกราฟที่สวยงาม เข้าใจง่าย
- **📦 Product Management**: ระบบจัดการข้อมูลสินค้า, หมวดหมู่, ราคา, และรูปภาพ
- **🏬 Inventory System**: ตรวจสอบและจัดการสต๊อกสินค้าแยกรายสาขา แจ้งเตือนเมื่อสินค้าใกล้หมด
- **🛒 Point of Sale (POS)**: หน้าจอขายหน้าร้านที่ออกแบบมาให้ใช้งานง่าย รองรับการคำนวณภาษีและส่วนลด
- **👥 User Management**: ระบบจัดการผู้ใช้งาน กำหนดสิทธิ์ (Role-based) เช่น Admin, Manager, Staff
- **🌗 Dark Mode**: รองรับโหมดมืด/สว่าง เพื่อความสบายตาในการใช้งาน
- **📱 Responsive Design**: รองรับการใช้งานผ่านมือถือและแท็บเล็ต

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes

## 🚀 วิธีการเริ่มต้นใช้งาน (Getting Started)

1. **Clone Project**

   ```bash
   git clone https://github.com/yourusername/sp-system.git
   cd sp-system
   ```

2. **ติดตั้ง Dependencies**

   ```bash
   npm install
   # หรือ
   yarn install
   ```

3. **รันโปรเจกต์ (Development Mode)**
   ```bash
   npm run dev
   ```
   เปิด Browser ไปที่ `http://localhost:3000`

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```
sp-system/
├── app/                  # Next.js App Router
│   ├── (auth)/          # หน้า Login (Authentication)
│   ├── (dashboard)/     # หน้าหลักระบบหลังบ้าน
│   ├── api/             # API Routes
│   └── layout.tsx       # Root Layout
├── components/           # React Components
│   ├── ui/              # Reusable UI Components (shadcn)
│   └── dashboard/       # Dashboard specific components
├── lib/                  # Utilities & Helper functions
└── public/               # Static assets
```

## 📄 ลิขสิทธิ์ (License)

สงวนลิขสิทธิ์ (All Rights Reserved) โดย SP System

ไม่อนุญาตให้นำไปใช้ ทำซ้ำ ดัดแปลง หรือเผยแพร่ต่อ โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากเจ้าของลิขสิทธิ์
