"use client"

import { useState } from "react"
import { useData } from "@/data/data-context"
import { useLanguage } from "@/data/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  ArrowUpDown,
  History,
  PackagePlus,
  ArrowRightLeft
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function InventoryPage() {
  const { stocks, products, branches, updateStock, transferStock } = useData();
  const { t } = useLanguage();
  
  const [selectedBranchId, setSelectedBranchId] = useState("BR-001"); // Default HQ
  const [searchTerm, setSearchTerm] = useState("");
  
  // Stock Adjustment State
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<'adjust' | 'transfer'>('adjust');
  const [adjProductId, setAdjProductId] = useState("");
  const [adjQuantity, setAdjQuantity] = useState("");
  const [targetBranchId, setTargetBranchId] = useState("");

  const filteredStocks = stocks.filter(s => 
    s.branchId === selectedBranchId &&
    products.find(p => p.id === s.productId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductName = (pid: string) => products.find(p => p.id === pid)?.name || "Unknown";
  const getProductSku = (pid: string) => products.find(p => p.id === pid)?.sku || "Unknown";

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(adjQuantity);
    
    if (adjustmentType === 'adjust') {
      updateStock(selectedBranchId, adjProductId, qty);
    } else {
      // Transfer
      if (!targetBranchId) return alert("Please select target branch");
      transferStock(selectedBranchId, targetBranchId, adjProductId, qty);
    }
    
    setIsAdjustOpen(false);
    setAdjProductId("");
    setAdjQuantity("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.inventoryTitle}</h2>
          <p className="text-muted-foreground">
            {t.inventoryDesc}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-background hover:bg-accent/50">
            <History className="mr-2 h-4 w-4" />
            Stock History
          </Button>
          
          <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <PackagePlus className="mr-2 h-4 w-4" />
                {t.adjustStock}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>จัดการสต๊อกสินค้า</DialogTitle>
                <DialogDescription>
                  ปรับปรุงยอดคงเหลือ หรือโอนย้ายสินค้าระหว่างสาขา
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdjustSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">ประเภทรายการ</Label>
                    <Select value={adjustmentType} onValueChange={(v:any) => setAdjustmentType(v)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adjust">ปรับยอด (Set Quantity)</SelectItem>
                        <SelectItem value="transfer">โอนย้าย (Transfer)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">สินค้า</Label>
                    <Select value={adjProductId} onValueChange={setAdjProductId}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="เลือกสินค้า" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {adjustmentType === 'transfer' && (
                    <div className="grid grid-cols-4 items-center gap-4">
                       <Label className="text-right">ไปยังสาขา</Label>
                       <Select value={targetBranchId} onValueChange={setTargetBranchId}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="เลือกสาขาปลายทาง" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.filter(b => b.id !== selectedBranchId).map(b => (
                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">จำนวน</Label>
                    <Input 
                      type="number" 
                      value={adjQuantity} 
                      onChange={e => setAdjQuantity(e.target.value)}
                      className="col-span-3"
                      placeholder="ระบุจำนวน"
                      required 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">บันทึก</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-lg border bg-card/50 p-4 shadow-sm backdrop-blur-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t.searchProduct} 
            className="pl-8 bg-background/50 border-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
             <SelectTrigger className="w-[200px] bg-background/50">
               <SelectValue placeholder="เลือกสาขา" />
             </SelectTrigger>
             <SelectContent>
               {branches.map(b => (
                 <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
               ))}
             </SelectContent>
           </Select>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-accent/50">
            <TableRow>
              <TableHead className="w-[100px]">{t.id}</TableHead>
              <TableHead>{t.productName}</TableHead>
              <TableHead>สาขา (Branch)</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                  {t.stock} <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>จุดสั่งซื้อ (Reorder Point)</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead className="text-right">{t.action}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map((item) => {
                const status = item.quantity <= 0 ? 'สินค้าหมด' : item.quantity <= item.reorderPoint ? 'สินค้าใกล้หมด' : 'ปกติ';
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-muted-foreground text-xs">{getProductSku(item.productId)}</TableCell>
                    <TableCell className="font-semibold">{getProductName(item.productId)}</TableCell>
                    <TableCell className="text-muted-foreground">{branches.find(b => b.id === item.branchId)?.name}</TableCell>
                    <TableCell className="font-bold">{item.quantity}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{item.reorderPoint}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        status === 'ปกติ' 
                          ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20' 
                          : status === 'สินค้าใกล้หมด'
                          ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20'
                          : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-500/20'
                      }`}>
                        {status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setAdjustmentType('adjust');
                        setAdjProductId(item.productId);
                        setAdjQuantity(item.quantity.toString());
                        setIsAdjustOpen(true);
                      }} className="h-8 text-primary hover:text-primary hover:bg-primary/10">
                        {t.adjustStock}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
               <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  ไม่พบข้อมูลสต๊อกในสาขานี้
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
