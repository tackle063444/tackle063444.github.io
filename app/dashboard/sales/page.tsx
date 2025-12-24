"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ScanBarcode, Minus, Plus, Trash2, CreditCard, Banknote, QrCode } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/data/language-context"

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
  const { t } = useLanguage();

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 md:flex-row animate-in fade-in duration-500">
      
      {/* Product List Section */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-xl border bg-card/50 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 p-4 border-b bg-accent/20">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t.searchProduct} 
              className="pl-8 bg-background/50"
            />
          </div>
          <Button variant="outline" size="icon" className="bg-background/50">
             <ScanBarcode className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="bg-background/50">{t.category}</Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
             {products.map((product) => (
               <div 
                key={product.id} 
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:bg-accent/50"
               >
                 <div className="aspect-square flex items-center justify-center text-4xl bg-muted/50">
                   {product.image}
                 </div>
                 <div className="p-3">
                   <h3 className="font-semibold truncate text-sm">{product.name}</h3>
                   <div className="mt-1 flex items-center justify-between">
                     <span className="font-bold text-primary">฿{product.price.toLocaleString()}</span>
                     <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Stock 12</Badge>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="flex w-full flex-col rounded-xl border bg-card/50 shadow-sm md:w-[400px] backdrop-blur-sm">
        <div className="flex items-center justify-between border-b p-4 bg-accent/20">
          <h2 className="font-semibold">{t.currentBill}</h2>
          <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
            {t.clearBill}
            <Trash2 className="ml-2 h-3 w-3" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {/* Cart Item Mock */}
           {[1, 2].map((i) => (
             <div key={i} className="flex items-start gap-3">
                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-lg">
                  {i === 1 ? '🖱️' : '⌨️'}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{i === 1 ? 'เมาส์ไร้สาย' : 'คีย์บอร์ด RGB'}</p>
                  <p className="text-sm text-primary font-bold">฿{i === 1 ? '1,290' : '3,500'}</p>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="icon" className="h-7 w-7 rounded-full bg-background/50">
                     <Minus className="h-3 w-3" />
                   </Button>
                   <span className="text-sm w-4 text-center">1</span>
                   <Button variant="outline" size="icon" className="h-7 w-7 rounded-full bg-background/50">
                     <Plus className="h-3 w-3" />
                   </Button>
                </div>
             </div>
           ))}
        </div>

        <div className="border-t p-6 bg-accent/10 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.total}</span>
              <span>฿4,790.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.tax}</span>
              <span>฿335.30</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>{t.total}</span>
              <span className="text-primary">฿5,125.30</span>
            </div>
          </div>
          
           <div className="grid grid-cols-3 gap-2 py-2">
             <Button variant="outline" className="flex flex-col h-16 items-center justify-center gap-1 border-primary/20 bg-primary/5 hover:bg-primary/10">
               <Banknote className="h-5 w-5" />
               <span className="text-[10px]">{t.cash}</span>
             </Button>
             <Button variant="outline" className="flex flex-col h-16 items-center justify-center gap-1 bg-background/50">
               <QrCode className="h-5 w-5" />
               <span className="text-[10px]">QR Code</span>
             </Button>
             <Button variant="outline" className="flex flex-col h-16 items-center justify-center gap-1 bg-background/50">
               <CreditCard className="h-5 w-5" />
               <span className="text-[10px]">{t.card}</span>
             </Button>
           </div>

          <Button className="w-full h-12 text-lg font-bold shadow-md">
            {t.checkout}
          </Button>
        </div>
      </div>
    </div>
  )
}
