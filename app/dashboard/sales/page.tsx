"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ScanBarcode, Minus, Plus, Trash2, CreditCard, Banknote, QrCode } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const products = [
  { id: 1, name: "เมาส์ไร้สาย", price: 1290, image: "🖱️" },
  { id: 2, name: "คีย์บอร์ด RGB", price: 3500, image: "⌨️" },
  { id: 3, name: "หูฟัง Bluetooth", price: 1590, image: "🎧" },
  { id: 4, name: "จอ 24 นิ้ว", price: 5900, image: "🖥️" },
  { id: 5, name: "USB Hub", price: 890, image: "🔌" },
  { id: 6, name: "แผ่นรองเมาส์", price: 290, image: "⬛" },
  { id: 7, name: "ขาตั้งจอ", price: 1200, image: "🏗️" },
  { id: 8, name: "กล้อง Webcam", price: 2500, image: "📷" },
]

export default function SalesPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 md:flex-row animate-in fade-in duration-500">
      
      {/* Product List Section */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-xl border bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2 p-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ค้นหาสินค้า..." 
              className="pl-8 bg-white dark:bg-slate-950"
            />
          </div>
          <Button variant="outline" size="icon">
             <ScanBarcode className="h-4 w-4" />
          </Button>
          <Button variant="outline">หมวดหมู่</Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
             {products.map((product) => (
               <div 
                key={product.id} 
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50"
               >
                 <div className="aspect-square flex items-center justify-center text-4xl bg-slate-50 dark:bg-slate-800">
                   {product.image}
                 </div>
                 <div className="p-3">
                   <h3 className="font-semibold truncate text-sm">{product.name}</h3>
                   <div className="mt-1 flex items-center justify-between">
                     <span className="font-bold text-indigo-600 dark:text-indigo-400">฿{product.price.toLocaleString()}</span>
                     <Badge variant="secondary" className="text-[10px] h-5 px-1.5">สต๊อก 12</Badge>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="flex w-full flex-col rounded-xl border bg-white dark:bg-slate-900 shadow-sm md:w-[400px]">
        <div className="flex items-center justify-between border-b p-4 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="font-semibold">ตะกร้าสินค้า (Order)</h2>
          <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
            ล้างตะกร้า
            <Trash2 className="ml-2 h-3 w-3" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {/* Cart Item Mock */}
           {[1, 2].map((i) => (
             <div key={i} className="flex items-start gap-3">
                <div className="h-12 w-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                  {i === 1 ? '🖱️' : '⌨️'}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{i === 1 ? 'เมาส์ไร้สาย' : 'คีย์บอร์ด RGB'}</p>
                  <p className="text-sm text-indigo-600 font-bold">฿{i === 1 ? '1,290' : '3,500'}</p>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="icon" className="h-7 w-7 rounded-full">
                     <Minus className="h-3 w-3" />
                   </Button>
                   <span className="text-sm w-4 text-center">1</span>
                   <Button variant="outline" size="icon" className="h-7 w-7 rounded-full">
                     <Plus className="h-3 w-3" />
                   </Button>
                </div>
             </div>
           ))}
        </div>

        <div className="border-t bg-slate-50 p-6 dark:bg-slate-900/50 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ยอดรวม (Subtotal)</span>
              <span>฿4,790.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ภาษี (Tax 7%)</span>
              <span>฿335.30</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>ยอดสุทธิ (Total)</span>
              <span className="text-indigo-600">฿5,125.30</span>
            </div>
          </div>
          
           <div className="grid grid-cols-3 gap-2 py-2">
             <Button variant="outline" className="flex flex-col h-16 items-center justify-center gap-1 border-primary/20 bg-primary/5 hover:bg-primary/10">
               <Banknote className="h-5 w-5" />
               <span className="text-[10px]">เงินสด</span>
             </Button>
             <Button variant="outline" className="flex flex-col h-16 items-center justify-center gap-1">
               <QrCode className="h-5 w-5" />
               <span className="text-[10px]">QR Code</span>
             </Button>
             <Button variant="outline" className="flex flex-col h-16 items-center justify-center gap-1">
               <CreditCard className="h-5 w-5" />
               <span className="text-[10px]">บัตรเครดิต</span>
             </Button>
           </div>

          <Button className="w-full h-12 text-lg font-bold shadow-md bg-indigo-600 hover:bg-indigo-700">
            รับชำระเงิน (Pay)
          </Button>
        </div>
      </div>
    </div>
  )
}
