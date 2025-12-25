"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useData } from "@/data/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { 
  Plus, 
  ArrowLeft,
  ShoppingCart,
  TrendingUp,
  Search,
  PlusCircle,
  MinusCircle,
  Boxes,
  RefreshCcw,
  Save,
  Package,
  Pencil,
  Store
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"

export default function BranchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const branchId = params.id as string
  const { products, getBranchById, adjustStock, addStockToBranch, updateBranch } = useData()
  
  const [branch, setBranch] = useState<any>(null)
  const [stats, setStats] = useState<any>({ today: 0, week: 0, year: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchStock, setSearchStock] = useState("")
  
  // Modals
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false)
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Adjustment Form
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const [adjustmentValue, setAdjustmentValue] = useState(0)
  
  // Add Stock Form
  const [selectedProductId, setSelectedProductId] = useState("")
  const [initialQuantity, setInitialQuantity] = useState(0)

  // Edit Branch Form
  const [editForm, setEditForm] = useState({ name: "", code: "", location: "", image: "" })

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [branchData, statsData] = await Promise.all([
        getBranchById(branchId),
        fetch(`/api/branches/${branchId}/stats`).then(res => res.json())
      ])
      
      if (!branchData) {
        toast.error("ไม่พบข้อมูลสาขา")
        router.push("/dashboard/branches")
        return
      }
      
      setBranch(branchData)
      setStats(statsData)
      setEditForm({
        name: branchData.name,
        code: branchData.code,
        location: branchData.location || "",
        image: branchData.image || ""
      })
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [branchId])

  const handleAdjust = async () => {
    if (!selectedStock || adjustmentValue === 0) return
    
    try {
      await adjustStock(branchId, selectedStock.productId, adjustmentValue)
      toast.success("ปรับปรุงสต๊อกสำเร็จ")
      setIsAdjustmentModalOpen(false)
      loadData()
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาด")
    }
  }

  const handleAddStock = async () => {
    if (!selectedProductId) return
    
    try {
      await addStockToBranch(branchId, selectedProductId, initialQuantity)
      toast.success("เพิ่มสินค้าเข้าสาขาสำเร็จ")
      setIsAddStockModalOpen(false)
      setSelectedProductId("")
      setInitialQuantity(0)
      loadData()
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาด")
    }
  }

  const handleUpdateBranch = async () => {
    try {
        await updateBranch(branchId, editForm)
        toast.success("แก้ไขข้อมูลสาขาสำเร็จ")
        setIsEditModalOpen(false)
        loadData()
    } catch (error) {
        toast.error("แก้ไขข้อมูลสาขาไม่สำเร็จ")
    }
  }

  if (isLoading && !branch) return <div className="p-8 text-center text-muted-foreground">กำลังโหลดข้อมูล...</div>

  const filteredStocks = branch?.stocks?.filter((s: any) => 
    s.productName.toLowerCase().includes(searchStock.toLowerCase()) || 
    s.productSku.toLowerCase().includes(searchStock.toLowerCase())
  ) || []

  const availableProducts = products.filter(p => 
    !branch?.stocks?.some((s: any) => s.productId === p.id)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/branches")} className="rounded-full h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                    {branch?.image ? (
                        <Image src={branch.image} alt={branch.name} fill className="object-cover" unoptimized />
                    ) : (
                        <Store className="h-8 w-8 text-primary" />
                    )}
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{branch?.name}</h2>
                    <div className="text-sm text-muted-foreground mt-1">
                        <Badge variant="outline" className="mr-2">{branch?.code}</Badge>
                        {branch?.location || "ไม่มีข้อมูลที่ตั้ง"}
                    </div>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/branches/${branchId}/sales`)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                ดูประวัติการขาย
            </Button>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                แก้ไขข้อมูลสาขา
            </Button>
        </div>
      </div>

      {/* Mini Dashboard */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary/[0.03] border-primary/10 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <ShoppingCart className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ยอดขายวันนี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">฿{(stats?.today || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
               <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Update
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500/[0.03] border-blue-500/10 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <TrendingUp className="h-24 w-24 text-blue-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">สัปดาห์นี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">฿{(stats?.week || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">ยอดรวมตั้งแต่ต้นสัปดาห์</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/[0.03] border-orange-500/10 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <TrendingUp className="h-24 w-24 text-orange-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ปีนี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-orange-600 dark:text-orange-400">฿{(stats?.year || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">รวมยอดขายตลอดปีปัจจุบัน</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Management */}
      <Card className="border-none shadow-sm bg-card/60 backdrop-blur-md">
        <CardHeader className="px-6 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Boxes className="h-5 w-5 text-primary" />
              จัดการสต๊อกสินค้า
            </CardTitle>
            <CardDescription>ควบคุมรายการผลิตภัณฑ์และจำนวนสินค้าในสาขานี้</CardDescription>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative w-full max-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสินค้า..."
                className="pl-10 h-10"
                value={searchStock}
                onChange={(e) => setSearchStock(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddStockModalOpen(true)} className="gap-2 h-10 px-4">
              <Plus className="h-4 w-4" />
              เพิ่มสินค้าเข้าสาขา
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-border">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold tracking-wider">รหัสสินค้า</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold tracking-wider">ชื่อสินค้า</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold tracking-wider text-center">สต๊อกคงเหลือ</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold tracking-wider text-center">จุดสั่งซื้อเพิ่ม</TableHead>
                  <TableHead className="px-6 h-12 uppercase text-[10px] font-bold tracking-wider text-right">การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Package className="h-12 w-12 opacity-20" />
                        <p>ยังไม่มีรายการสินค้าในสาขานี้</p>
                        <Button variant="link" onClick={() => setIsAddStockModalOpen(true)}>กดที่นี่เพื่อเพิ่มสินค้าชิ้นแรก</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStocks.map((stock: any) => (
                    <TableRow key={stock.id} className="hover:bg-muted/20 transition-colors border-b border-border/50 last:border-0">
                      <TableCell className="px-6 py-4 font-mono text-xs">{stock.productSku}</TableCell>
                      <TableCell className="px-6 py-4">
                         <div className="font-semibold">{stock.productName}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Badge variant={stock.quantity > stock.reorderPoint ? "secondary" : "destructive"} className="px-4 py-1 text-base font-bold rounded-md">
                          {stock.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center text-muted-foreground font-medium">
                        {stock.reorderPoint}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors" size="sm" onClick={() => {
                          setSelectedStock(stock)
                          setAdjustmentValue(0)
                          setIsAdjustmentModalOpen(true)
                        }}>
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          ปรับสต๊อก
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Adjustment Modal */}
      <Dialog open={isAdjustmentModalOpen} onOpenChange={setIsAdjustmentModalOpen}>
        <DialogContent className="sm:max-w-[400px] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">ปรับจำนวนสต๊อก</DialogTitle>
            <DialogDescription className="font-medium text-primary">
              {selectedStock?.productName}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-8 py-8 px-4 bg-muted/30 rounded-2xl my-4">
            <div className="text-center space-y-1">
              <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">จำนวนปัจจุบัน</Label>
              <div className="text-5xl font-black tracking-tighter">{selectedStock?.quantity || 0}</div>
            </div>
            
            <div className="flex items-center gap-6">
               <Button 
                variant="outline" 
                size="icon" 
                className="h-16 w-16 rounded-3xl border-2 hover:bg-red-500/10 hover:border-red-500/50 transition-all active:scale-95"
                onClick={() => setAdjustmentValue(prev => prev - 1)}
               >
                <MinusCircle className="h-8 w-8 text-red-500" />
               </Button>
               
               <div className="flex flex-col items-center gap-2">
                  <Input 
                    type="number" 
                    className="text-center text-3xl font-black h-16 w-28 bg-background border-2 border-primary/20 focus-visible:ring-primary/30" 
                    value={adjustmentValue} 
                    onChange={(e) => setAdjustmentValue(parseInt(e.target.value) || 0)}
                  />
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">QTY TO CHANGE</Badge>
               </div>

               <Button 
                variant="outline" 
                size="icon" 
                className="h-16 w-16 rounded-3xl border-2 hover:bg-green-500/10 hover:border-green-500/50 transition-all active:scale-95"
                onClick={() => setAdjustmentValue(prev => prev + 1)}
               >
                <PlusCircle className="h-8 w-8 text-green-500" />
               </Button>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-background shadow-sm border text-center">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">ผลลัพธ์</p>
                  <p className={`text-2xl font-black ${(selectedStock?.quantity || 0) + adjustmentValue < 0 ? 'text-red-500' : 'text-primary'}`}>
                    {(selectedStock?.quantity || 0) + adjustmentValue}
                  </p>
               </div>
               <div className="p-4 rounded-xl bg-background shadow-sm border text-center">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">สถานะ</p>
                  <p className="text-xs font-bold leading-relaxed">
                    {adjustmentValue > 0 ? 'รับสินค้าเข้า' : adjustmentValue < 0 ? 'จ่ายสินค้าออก' : 'ไม่มีการเปลี่ยน'}
                  </p>
               </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsAdjustmentModalOpen(false)} className="h-12 flex-1">ยกเลิก</Button>
            <Button onClick={handleAdjust} disabled={adjustmentValue === 0} className="h-12 flex-[2] font-bold">
               <Save className="h-4 w-4 mr-2" />
               ยืนยันการบันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Stock Modal */}
      <Dialog open={isAddStockModalOpen} onOpenChange={setIsAddStockModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">เพิ่มสินค้าเข้าสาขา</DialogTitle>
            <DialogDescription>เลือกสินค้าจากฐานข้อมูลหลักเพื่อนำมาวางขายที่สาขานี้</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6 font-primary">
             <div className="grid gap-3">
                <Label className="font-bold text-sm tracking-wide">ค้นหาและเลือกสินค้า</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="h-12 shadow-sm">
                    <SelectValue placeholder="ค้นหาตามชื่อ หรือ SKU..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {availableProducts.length > 0 ? (
                      availableProducts.map(p => (
                        <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                          <div className="flex flex-col py-1">
                             <span className="font-bold">{p.name}</span>
                             <span className="text-[10px] text-muted-foreground uppercase">{p.sku} | ฿{p.basePrice.toLocaleString()}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground space-y-2">
                        <Package className="h-8 w-8 mx-auto opacity-20" />
                        <p className="text-xs">ไม่มีสินค้าใหม่ให้เพิ่ม<br/>กรุณาเพิ่มสินค้าใหม่ในระบบหลักก่อน</p>
                      </div>
                    )}
                  </SelectContent>
                </Select>
             </div>
             <div className="grid gap-3">
                <Label htmlFor="initialQty" className="font-bold text-sm tracking-wide">จำนวนเริ่มต้น (สต๊อกยกมา)</Label>
                <div className="relative">
                   <Boxes className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   <Input 
                    id="initialQty" 
                    type="number" 
                    className="h-12 pl-12 text-lg font-bold"
                    placeholder="0"
                    value={initialQuantity}
                    onChange={(e) => setInitialQuantity(parseInt(e.target.value) || 0)}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">ระบบจะนำสินค้าเข้าสต๊อกของสาขานี้ทันทีหลังจากกดยืนยัน</p>
             </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddStockModalOpen(false)} className="h-12">ยกเลิก</Button>
            <Button onClick={handleAddStock} disabled={!selectedProductId} className="h-12 px-8 font-bold">เพิ่มเข้าสต๊อกสาขา</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Branch Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลสาขา</DialogTitle>
            <DialogDescription>
              แก้ไขรายละเอียดของสาขา
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="flex justify-center">
                 <ImageUpload 
                    value={editForm.image} 
                    onChange={(url) => setEditForm({...editForm, image: url})}
                    onRemove={() => setEditForm({...editForm, image: ""})}
                 />
             </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">ชื่อสาขา</Label>
              <Input 
                id="edit-name" 
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-code">รหัสสาขา</Label>
              <Input 
                id="edit-code" 
                value={editForm.code}
                onChange={(e) => setEditForm({...editForm, code: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">ที่ตั้ง / รายละเอียด</Label>
              <Input 
                id="edit-location" 
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleUpdateBranch}>บันทึกการแก้ไข</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
