"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useData } from "@/data/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Search,
  FileText,
  User,
  Package,
  Clock
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function BranchSalesHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const branchId = params.id as string
  const { getBranchById } = useData()
  
  const [branch, setBranch] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const fetchBranch = async () => {
        const b = await getBranchById(branchId)
        setBranch(b)
    }
    fetchBranch()
  }, [branchId])

  useEffect(() => {
    const fetchTransactions = async () => {
        setIsLoading(true)
        try {
            let url = `/api/branches/${branchId}/transactions`
            if (date) {
                const dateStr = format(date, 'yyyy-MM-dd')
                url += `?from=${dateStr}&to=${dateStr}`
            }
            const res = await fetch(url)
            if (res.ok) {
                const data = await res.json()
                setTransactions(data)
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error)
        } finally {
            setIsLoading(false)
        }
    }
    fetchTransactions()
  }, [branchId, date])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/branches/${branchId}`)} className="rounded-full h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
                <h2 className="text-3xl font-bold tracking-tight">ประวัติการขาย</h2>
                <p className="text-muted-foreground">
                    {branch ? `สาขา ${branch.name} (${branch.code})` : "กำลังโหลด..."}
                </p>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: th }) : <span>เลือกวันที่</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={() => setDate(undefined)}>
                ล้างตัวกรอง
            </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        รายการบิลขาย
                   </CardTitle>
                   <CardDescription>แสดงรายการขายทั้งหมดเรียงตามเวลาล่าสุด</CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                    ยอดรวม {transactions.length} รายการ
                </Badge>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[180px] px-6">วันที่ / เวลา</TableHead>
                <TableHead className="px-6">รายการสินค้า (Summary)</TableHead>
                <TableHead className="px-6 text-center">จำนวนรวม</TableHead>
                <TableHead className="px-6 text-right">ยอดสุทธิ</TableHead>
                <TableHead className="px-6">พนักงานขาย</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                 <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                             <span className="animate-spin">⏳</span> กำลังโหลดข้อมูล...
                        </div>
                    </TableCell>
                 </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                    ไม่พบข้อมูลการขายในช่วงเวลานี้
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-primary">
                                {format(new Date(tx.createdAt), "d MMM yyyy", { locale: th })}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(tx.createdAt), "HH:mm", { locale: th })} น.
                            </span>
                        </div>
                    </TableCell>
                    <TableCell className="px-6">
                        <div className="space-y-1">
                            {tx.items.slice(0, 2).map((item: any) => (
                                <div key={item.id} className="text-sm">
                                    <span className="font-medium text-foreground/80">{item.product.name}</span>
                                    <span className="text-muted-foreground mx-2">x{item.quantity}</span>
                                </div>
                            ))}
                            {tx.items.length > 2 && (
                                <div className="text-xs text-muted-foreground italic">
                                    ...และอีก {tx.items.length - 2} รายการ
                                </div>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="px-6 text-center">
                         <Badge variant="outline">
                            {tx.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} ชิ้น
                         </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-right font-mono font-bold text-lg">
                        ฿{Number(tx.totalAmount).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-sm font-medium">{tx.createdBy?.name || "ไม่ระบุ"}</div>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
