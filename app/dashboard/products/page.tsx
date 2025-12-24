"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Pencil, 
  Trash2,
  FileDown
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProductForm } from "@/components/dashboard/product-form"

// Mock data
const products = [
  { id: "PROD-0001", name: "เมาส์ไร้สายพรีเมียม (Premium Wireless Mouse)", category: "อิเล็กทรอนิกส์", price: 1290.00, stock: 45, status: "มีสินค้า" },
  { id: "PROD-0002", name: "คีย์บอร์ด RGB (Mechanical Keyboard)", category: "อิเล็กทรอนิกส์", price: 3500.00, stock: 12, status: "สินค้าใกล้หมด" },
  { id: "PROD-0003", name: "เก้าอี้ทำงาน (Ergonomic Chair)", category: "เฟอร์นิเจอร์", price: 8900.00, stock: 4, status: "วิกฤต" },
  { id: "PROD-0004", name: "USB-C Hub", category: "อุปกรณ์เสริม", price: 890.00, stock: 120, status: "มีสินค้า" },
  { id: "PROD-0005", name: "แท่นวางโน๊ตบุ๊ค", category: "อุปกรณ์เสริม", price: 590.00, stock: 0, status: "สินค้าหมด" },
  { id: "PROD-0006", name: "จอคอมพิวเตอร์ 27 นิ้ว 4K", category: "อิเล็กทรอนิกส์", price: 12500.00, stock: 8, status: "สินค้าใกล้หมด" },
  { id: "PROD-0007", name: "หูฟังบลูทูธ", category: "เครื่องเสียง", price: 1590.00, stock: 30, status: "มีสินค้า" },
]

export default function ProductsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">จัดการสินค้า (Products)</h2>
          <p className="text-muted-foreground">
            จัดการรายการสินค้า ราคา และข้อมูลเบื้องต้น
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            ส่งออก (Export)
          </Button>
          <ProductForm />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 border-slate-200/60 dark:border-slate-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ค้นหาสินค้า..." 
            className="pl-8 bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            หมวดหมู่
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            สถานะสต๊อก
          </Button>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="w-[100px]">รหัสสินค้า</TableHead>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead>ราคา</TableHead>
              <TableHead>คงเหลือ</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-muted-foreground text-xs">{product.id}</TableCell>
                <TableCell className="font-semibold">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-md font-normal">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>฿{product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    product.status === 'มีสินค้า' 
                      ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20' 
                      : product.status === 'สินค้าใกล้หมด'
                      ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20'
                      : product.status === 'วิกฤต'
                      ? 'bg-orange-50 text-orange-800 ring-orange-600/20 dark:bg-orange-900/10 dark:text-orange-400 dark:ring-orange-500/20'
                      : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-500/20'
                  }`}>
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          แสดง 7 จาก 124 รายการ
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            ก่อนหน้า
          </Button>
          <Button variant="outline" size="sm">
            ถัดไป
          </Button>
        </div>
      </div>
    </div>
  )
}
