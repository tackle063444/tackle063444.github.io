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
  ArrowUpDown,
  History,
  PackagePlus
} from "lucide-react"

// Mock data
const inventory = [
  { id: "PROD-0001", name: "เมาส์ไร้สายพรีเมียม (Premium Wireless Mouse)", branch: "สำนักงานใหญ่ (HQ)", stock: 45, reorderPoint: 50, status: "สินค้าใกล้หมด" },
  { id: "PROD-0001", name: "เมาส์ไร้สายพรีเมียม (Premium Wireless Mouse)", branch: "สาขาสยาม", stock: 120, reorderPoint: 50, status: "ปกติ" },
  { id: "PROD-0002", name: "คีย์บอร์ด RGB", branch: "สำนักงานใหญ่ (HQ)", stock: 12, reorderPoint: 20, status: "สินค้าใกล้หมด" },
  { id: "PROD-0003", name: "เก้าอี้ทำงาน", branch: "สำนักงานใหญ่ (HQ)", stock: 4, reorderPoint: 5, status: "วิกฤต" },
  { id: "PROD-0006", name: "จอ 27 นิ้ว 4K", branch: "สาขาเซ็นทรัล", stock: 8, reorderPoint: 10, status: "สินค้าใกล้หมด" },
]

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">จัดการสต๊อก (Inventory)</h2>
          <p className="text-muted-foreground">
            ตรวจสอบจำนวนสินค้าคงเหลือในแต่ละสาขา และจัดการการเติมสินค้า
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            ประวัติสต๊อก
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <PackagePlus className="mr-2 h-4 w-4" />
            รับสินค้าเข้า (Restock)
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 border-slate-200/60 dark:border-slate-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ค้นหาด้วยรหัส หรือ ชื่อสินค้า..." 
            className="pl-8 bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800"
          />
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            สาขา: ทั้งหมด
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            สถานะ
          </Button>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="w-[100px]">รหัส (SKU)</TableHead>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>สาขา</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                  คงเหลือ <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>จุดสั่งซื้อ (Reorder)</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium text-muted-foreground text-xs">{item.id}</TableCell>
                <TableCell className="font-semibold">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.branch}</TableCell>
                <TableCell className="font-bold">{item.stock}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{item.reorderPoint}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    item.status === 'ปกติ' 
                      ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20' 
                      : item.status === 'สินค้าใกล้หมด'
                      ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20'
                      : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-500/20'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                   <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                     ปรับยอด
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
