"use client"

import { useState } from "react"
import { useData } from "@/data/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { 
  Search, 
  Minus, 
  Plus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  QrCode,
  Store,
  ArrowLeft,
  ShoppingCart,
  Package,
  Boxes
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"

export default function SalesPage() {
  const { branches, products, getBranchById } = useData()
  
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  const [branchStocks, setBranchStocks] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingBranch, setIsLoadingBranch] = useState(false)
  // Mobile view state
  const [mobileView, setMobileView] = useState<'catalog' | 'cart'>('catalog')
  
  // 1. Branch Selection Screen
  if (!selectedBranch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4 max-w-2xl px-4">
          <Badge className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-black rounded-full bg-primary/10 text-primary border-primary/20">Point of Sale System</Badge>
          <h2 className="text-5xl font-black tracking-tighter sm:text-6xl">เลือกสาขาที่จะขาย</h2>
          <p className="text-muted-foreground text-lg font-medium">กรุณาระบุสาขาที่คุณกำลังประจำการเพื่อดำเนินการขายและตัดสต๊อกให้ถูกต้อง</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl px-6">
          {branches.map(branch => (
            <Card 
              key={branch.id} 
              className="cursor-pointer hover:border-primary hover:bg-primary/[0.03] transition-all group relative overflow-hidden h-48 flex flex-col justify-center border-2 border-transparent bg-card/50 shadow-sm"
              onClick={async () => {
                setIsLoadingBranch(true)
                try {
                  const data = await getBranchById(branch.id)
                  setSelectedBranch(data)
                  setBranchStocks(data?.stocks || [])
                } catch (e) {
                  toast.error("เข้าถึงข้อมูลสาขาไม่ได้")
                } finally {
                  setIsLoadingBranch(false)
                }
              }}
            >
              <CardHeader className="text-center z-10">
                <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 relative overflow-hidden">
                  {branch.image ? (
                    <Image src={branch.image} alt={branch.name} fill className="object-cover" unoptimized />
                  ) : (
                    <Store className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                  )}
                </div>
                <CardTitle className="text-2xl font-black">{branch.name}</CardTitle>
                <CardDescription className="font-mono text-xs uppercase tracking-widest mt-1">{branch.code}</CardDescription>
              </CardHeader>
              <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <Store className="h-32 w-32" />
              </div>
            </Card>
          ))}
        </div>
        {isLoadingBranch && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="font-bold tracking-widest uppercase text-xs">กำลังเตรียมระบบ POS...</p>
             </div>
          </div>
        )}
      </div>
    )
  }

  // 2. POS Interface Logic
  const filteredStocks = branchStocks.filter(s => 
    s.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.productSku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (stock: any) => {
    if (stock.quantity <= 0) {
      toast.error("สินค้าหมดสต๊อกในสาขานี้")
      return
    }

    const existing = cart.find(item => item.productId === stock.productId)
    if (existing) {
      if (existing.quantity >= stock.quantity) {
        toast.error("จำนวนในตะกร้าเท่ากับจำนวนสต๊อกที่มีขีดขายแล้ว")
        return
      }
      setCart(cart.map(item => 
        item.productId === stock.productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ))
    } else {
      const product = products.find(p => p.id === stock.productId)
      setCart([...cart, { 
        productId: stock.productId, 
        name: stock.productName, 
        price: product?.basePrice || 0,
        quantity: 1,
        maxCount: stock.quantity,
        sku: stock.productSku
      }])
    }
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta
        if (newQty < 1) return item
        if (newQty > item.maxCount) {
           toast.error(`สินค้าในสต๊อกเหลือเพียง ${item.maxCount} ชิ้น`)
           return item
        }
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId))
  }

  const baseTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const vat = baseTotal * 0.07
  const finalTotal = baseTotal + vat

  const handleCheckout = async (method: string) => {
    if (cart.length === 0) return
    setIsProcessing(true)
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: selectedBranch.id,
          items: cart,
          totalAmount: finalTotal,
          note: `Pay via: ${method}`
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Checkout failed")
      }
      
      toast.success("ขายสินค้าและตัดสต๊อกเรียบร้อยแล้ว!")
      setCart([])
      // Refresh current branch stocks
      const updated = await getBranchById(selectedBranch.id)
      setSelectedBranch(updated)
      setBranchStocks(updated?.stocks || [])
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการจ่ายเงิน")
    } finally {
      setIsProcessing(false)
    }
  }


  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-6 lg:flex-row animate-in fade-in duration-700 relative">
      
      {/* LEFT: Product Catalog */}
      <div className={`flex flex-1 flex-col gap-4 overflow-hidden rounded-3xl border bg-card/40 shadow-2xl backdrop-blur-xl border-white/10 ${mobileView === 'cart' ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 border-b bg-muted/20">
          <Button variant="ghost" size="icon" onClick={() => setSelectedBranch(null)} className="h-12 w-12 rounded-2xl hover:bg-background shadow-sm border border-transparent hover:border-border transition-all">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
             <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                <span className="text-lg font-black tracking-tight">{selectedBranch.name}</span>
             </div>
             <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-0.5">{selectedBranch.code} POS ACTIVE</div>
          </div>
          <div className="relative flex-[1.5]">
            <Boxes className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground opacity-50" />
            <Input 
              placeholder="ค้นหาชื่อสินค้า..." 
              className="pl-12 h-14 bg-background/80 border-2 border-transparent focus-visible:border-primary/30 border-primary/30 transition-all text-base rounded-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide pb-24 lg:pb-8">
           <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredStocks.map((stock) => {
                const inCartQty = cart.find(item => item.productId === stock.productId)?.quantity || 0
                const remainingStock = stock.quantity - inCartQty
                
                return (
                <div 
                 key={stock.id} 
                 className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-card/60 p-1.5 transition-all duration-300 hover:shadow-lg hover:border-primary hover:-translate-y-1 active:scale-95 ${remainingStock <= 0 ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                 onClick={() => {
                   addToCart(stock)
                   toast.success("เพิ่มลงออเดอร์แล้ว")
                 }}
                >
                     <div className="aspect-square flex items-center justify-center text-3xl sm:text-4xl bg-muted/30 rounded-2xl relative overflow-hidden transition-all group-hover:bg-primary/5">
                        {stock.productImage ? (
                           <Image src={stock.productImage} alt={stock.productName} fill className="object-cover" unoptimized />
                        ) : (
                           <>
                              <Package className="h-10 w-10 sm:h-14 sm:w-14 opacity-[0.03] absolute rotate-12" />
                              📦
                           </>
                        )}
                     {remainingStock <= 10 && remainingStock > 0 && (
                       <div className="absolute top-2 left-2 right-2 flex justify-start">
                          <Badge className="bg-orange-500 hover:bg-orange-600 border-none font-black text-[9px] h-5 px-1.5 line-clamp-1">LOW</Badge>
                       </div>
                     )}
                     {remainingStock <= 0 && (
                       <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                          <Badge variant="destructive" className="font-black text-[10px] uppercase">Sold Out</Badge>
                       </div>
                     )}
                  </div>
                  <div className="p-3 sm:p-4 space-y-2">
                    <h3 className="font-bold text-xs sm:text-sm leading-relaxed line-clamp-2 h-12 sm:h-14 w-full break-words" title={stock.productName}>{stock.productName}</h3>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center justify-between gap-1 sm:gap-2">
                         <span className="font-black text-sm sm:text-base lg:text-lg text-primary tracking-tighter">฿{products.find(p => p.id === stock.productId)?.basePrice.toLocaleString()}</span>
                         <Badge variant={remainingStock > 10 ? "secondary" : "destructive"} className="text-[9px] sm:text-[10px] font-bold h-5 px-1.5 shrink-0">
                           {remainingStock}
                         </Badge>
                       </div>
                    </div>
                  </div>
                </div>
              )})}
           </div>
           {filteredStocks.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 py-20 opacity-30">
                 <Search className="h-24 w-24" />
                 <p className="text-2xl font-black italic uppercase">Product Not Found</p>
              </div>
           )}
        </div>
      </div>

      {/* RIGHT: Transaction Cart */}
      <div className={`flex w-full flex-col rounded-[2.5rem] border-2 border-primary/5 bg-card/60 shadow-2xl lg:w-[380px] backdrop-blur-3xl relative overflow-hidden ${mobileView === 'catalog' ? 'hidden lg:flex' : 'flex flex-1'}`}>
        {/* Cart Header */}
        <div className="p-4 sm:p-6 sm:pb-4 border-b border-primary/5 bg-primary/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                 <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <h2 className="font-black text-lg sm:text-xl tracking-tighter uppercase">Bill Summary</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8 px-4 border-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all font-bold text-[10px]"
              onClick={() => setCart([])}
              disabled={cart.length === 0}
            >
              CLEAR BILL
            </Button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide pb-24 lg:pb-8">
           {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center gap-6 text-muted-foreground/30 py-10">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-dashed border-muted-foreground/20 flex items-center justify-center">
                   <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16" />
                </div>
                <p className="font-black text-lg sm:text-xl italic uppercase tracking-widest">Waiting for items...</p>
             </div>
           ) : (
             cart.map((item) => (
               <div key={item.productId} className="flex items-center gap-3 sm:gap-4 animate-in slide-in-from-right-8 duration-300">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-muted/40 p-2 sm:p-2.5 border border-white/10 flex items-center justify-center text-xl sm:text-2xl shadow-inner group shrink-0">
                    📦
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-black truncate text-xs sm:text-sm tracking-tight leading-tight">{item.name}</p>
                    <p className="font-black text-primary text-sm sm:text-base tracking-tighter">฿{item.price.toLocaleString()}</p>
                    <Badge variant="outline" className="text-[8px] font-bold border-muted-foreground/20 uppercase tracking-tighter opacity-60">SKU: {item.sku}</Badge>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <div className="flex items-center gap-2 sm:gap-3 bg-muted/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                        <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                           onClick={() => updateQuantity(item.productId, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm sm:text-base font-black w-5 sm:w-6 text-center">{item.quantity}</span>
                        <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                           onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Payment Summary */}
        <div className="p-4 sm:p-6 bg-muted/30 border-t border-primary/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] space-y-4 sm:space-y-6 pb-24 lg:pb-8">
          <div className="space-y-3 sm:space-y-4 px-2">
            <div className="flex justify-between items-center text-sm font-bold opacity-60">
              <span className="uppercase tracking-[0.2em]">Subtotal</span>
              <span className="tracking-tighter">฿{baseTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold opacity-60">
              <span className="uppercase tracking-[0.2em]">VAT (7%)</span>
              <span className="tracking-tighter">฿{vat.toLocaleString()}</span>
            </div>
            <Separator className="bg-primary/20 h-0.5" />
            <div className="flex justify-between items-end pt-2">
              <span className="text-base font-black uppercase tracking-tighter text-muted-foreground">Grand Total</span>
              <div className="flex flex-col items-end">
                 <span className="text-2xl sm:text-3xl font-black text-primary tracking-tighter leading-none">฿{finalTotal.toLocaleString()}</span>
                 <div className="h-1.5 w-full bg-primary/20 mt-1 rounded-full" />
              </div>
            </div>
          </div>
          
           <div className="grid grid-cols-3 gap-2 sm:gap-3">
             <Button 
               variant="outline" 
               className="flex flex-col h-14 sm:h-16 items-center justify-center gap-1.5 sm:gap-2 border-2 rounded-2xl hover:border-green-500 hover:bg-green-500/5 transition-all shadow-sm group active:scale-95"
               onClick={() => handleCheckout("CASH")}
               disabled={cart.length === 0 || isProcessing}
             >
               <Banknote className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 group-hover:scale-110 transition-transform" />
               <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-green-600">Cash</span>
             </Button>
             <Button 
               variant="outline" 
               className="flex flex-col h-14 sm:h-16 items-center justify-center gap-1.5 sm:gap-2 border-2 rounded-2xl hover:border-blue-500 hover:bg-blue-500/5 transition-all shadow-sm group active:scale-95"
               onClick={() => handleCheckout("PROMPTPAY")}
               disabled={cart.length === 0 || isProcessing}
             >
               <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 group-hover:scale-110 transition-transform" />
               <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-blue-600">Transfer</span>
             </Button>
             <Button 
               variant="outline" 
               className="flex flex-col h-14 sm:h-16 items-center justify-center gap-1.5 sm:gap-2 border-2 rounded-2xl hover:border-orange-500 hover:bg-orange-500/5 transition-all shadow-sm group active:scale-95"
               onClick={() => handleCheckout("CARD")}
               disabled={cart.length === 0 || isProcessing}
             >
               <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 group-hover:scale-110 transition-transform" />
               <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-orange-600">Card</span>
             </Button>
           </div>

          <Button 
            className="w-full h-12 sm:h-14 text-lg sm:text-xl font-black shadow-[0_15px_30px_rgba(0,0,0,0.15)] rounded-2xl bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] uppercase tracking-tighter"
            disabled={cart.length === 0 || isProcessing}
            onClick={() => handleCheckout("MANUAL")}
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                 <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                 <ShoppingCart className="h-5 w-5" />
                 <span>Complete Transaction</span>
              </div>
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-foreground/90 backdrop-blur-md rounded-full p-2 flex items-center justify-between shadow-2xl text-background border border-white/10">
          <Button 
            variant="ghost" 
            className={`flex-1 rounded-full gap-2 hover:bg-white/10 hover:text-white ${mobileView === 'catalog' ? 'bg-background text-foreground shadow-lg font-bold' : 'text-zinc-400'}`}
            onClick={() => setMobileView('catalog')}
          >
            <Boxes className="h-4 w-4" />
            Catalog
          </Button>
          <div className="w-px h-6 bg-white/20" />
          <Button 
            variant="ghost" 
            className={`flex-1 rounded-full gap-2 hover:bg-white/10 hover:text-white ${mobileView === 'cart' ? 'bg-background text-foreground shadow-lg font-bold' : 'text-zinc-400 function-bold'}`}
            onClick={() => setMobileView('cart')}
          >
            <div className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            {cart.length > 0 && <span className="text-[10px] ml-1 opacity-60">฿{finalTotal.toLocaleString()}</span>}
            Bill
          </Button>
        </div>
      </div>
    </div>
  )
}
