"use client"

import { useState, useEffect } from "react"
import { useData } from "@/data/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  Package, 
  Activity, 
  TrendingUp,
  CreditCard,
  CalendarDays,
  Store
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { branches } = useData()
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const url = selectedBranch === "all" 
        ? "/api/dashboard/stats" 
        : `/api/dashboard/stats?branchId=${selectedBranch}`
      const res = await fetch(url)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error("Dashboard error:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [selectedBranch])

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">กำลังรวบรวมข้อมูลจากสาขา...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Filter Area */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-card/40 p-6 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-md">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tighter">แดชบอร์ดสรุปผล</h2>
          <div className="flex items-center gap-2">
             <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black px-3">OVERVIEW</Badge>
             <p className="text-muted-foreground font-medium text-sm italic">วิเคราะห์ภาพรวมธุรกิจและบริหารจัดการสต๊อกรายสาขา</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/40 p-2 rounded-2xl border border-white/5">
           <div className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden lg:block">ตัวกรองข้อมูล:</div>
           <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[240px] h-12 rounded-xl border-none shadow-inner bg-background/80 font-bold">
              <SelectValue placeholder="เลือกดูข้อมูลสาขา" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-primary/10 shadow-2xl">
              <SelectItem value="all" className="font-bold cursor-pointer">ทุกสาขา (รวมทั้งหมด)</SelectItem>
              {branches.map(b => (
                <SelectItem key={b.id} value={b.id} className="cursor-pointer">{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Revenue Card */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/10 shadow-lg relative overflow-hidden group rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 opacity-60">รายได้รวมทั้งหมด</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
               <DollarSign className="h-4 w-4 text-emerald-500 group-hover:rotate-12 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter text-emerald-600 dark:text-emerald-300">฿{stats?.totalRevenue?.toLocaleString() || 0}</div>
            <div className="text-[10px] font-black text-emerald-500/80 mt-3 flex items-center gap-1.5">
               <div className="h-4 w-1 bg-emerald-500 rounded-full" /> TOTAL TRANSACTION VOLUME
            </div>
          </CardContent>
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] grayscale">
             <DollarSign className="h-32 w-32" />
          </div>
        </Card>

        {/* Sales Count Card */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/10 shadow-lg relative overflow-hidden group rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 opacity-60">จำนวนการขาย</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
               <CreditCard className="h-4 w-4 text-blue-500 group-hover:rotate-12 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-300">{stats?.salesCount?.toLocaleString() || 0}</div>
            <div className="text-[10px] font-black text-blue-500/80 mt-3 flex items-center gap-1.5">
               <div className="h-4 w-1 bg-blue-500 rounded-full" /> COMPLETED ORDERS
            </div>
          </CardContent>
        </Card>

        {/* Stock Card */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/10 shadow-lg relative overflow-hidden group rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 opacity-60">สต๊อกรวมสาขา</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
               <Package className="h-4 w-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter text-indigo-600 dark:text-indigo-300">{stats?.totalStock?.toLocaleString() || 0}</div>
            <div className="text-[10px] font-black text-indigo-500/80 mt-3 flex items-center gap-1.5 text-ellipsis overflow-hidden">
               <div className="h-4 w-1 bg-indigo-500 rounded-full" /> TOTAL ITEMS IN SHELVES
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Activity Card */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/10 shadow-lg relative overflow-hidden group rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 opacity-60">สินค้าใกล้หมด</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
               <Activity className="h-4 w-4 text-amber-500 group-hover:rotate-12 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-black tracking-tighter ${stats?.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {stats?.lowStockCount?.toLocaleString() || 0}
            </div>
            <div className="text-[10px] font-black text-amber-500/80 mt-3 flex items-center gap-1.5">
               <div className="h-4 w-1 bg-amber-500 rounded-full" /> ITEMS NEED RESTOCKING
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Activities Row */}
      <div className="grid gap-8 lg:grid-cols-7">
        
        {/* Sales Trends Chart (Visual Representation) */}
        <Card className="lg:col-span-4 border-none shadow-[0_30px_60px_rgba(0,0,0,0.1)] bg-card/60 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black tracking-tight uppercase">สถิติยอดขาย 12 เดือน</CardTitle>
              <CardDescription className="text-xs font-bold text-primary italic">Analytics based on current filter</CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
               <CalendarDays className="h-5 w-5 text-muted-foreground opacity-40" />
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-10">
            <div className="h-[320px] w-full flex items-end justify-between gap-3 px-4 relative">
               {/* Grid Lines mockup */}
               <div className="absolute inset-x-4 inset-y-0 flex flex-col justify-between pointer-events-none opacity-5">
                  {[0, 1, 2, 3, 4].map(line => <div key={line} className="w-full h-[1px] bg-foreground" />)}
               </div>

               {[40, 65, 45, 100, 70, 85, 60, 80, 45, 95, 55, 75].map((h, i) => (
                 <div key={i} className="group relative flex flex-col items-center gap-4 w-full h-full justify-end">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-foreground text-background text-[11px] font-black px-3 py-1.5 rounded-xl shadow-2xl z-20 scale-50 group-hover:scale-100">
                       ฿{(h * 1250).toLocaleString()}
                    </div>
                    <div 
                      className="w-full max-w-[28px] rounded-2xl bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:shadow-[0_15px_30px_rgba(var(--primary),0.4)] relative overflow-hidden active:scale-95"
                      style={{ height: `${h}%` }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest rotate-[-45deg] sm:rotate-0 mt-2">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                    </span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions List */}
        <Card className="lg:col-span-3 border-none shadow-[0_30px_60px_rgba(0,0,0,0.1)] bg-card/85 backdrop-blur-3xl rounded-[2.5rem] relative overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black tracking-tight uppercase">การขายล่าสุด</CardTitle>
            <CardDescription className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-2 mt-1">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </span>
               Live Transaction Feed
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <div className="space-y-8 mt-4">
              {stats?.recentSales?.length > 0 ? (
                stats.recentSales.map((sale: any, idxValue: number) => (
                  <div key={sale.id} className="flex items-center group animate-in slide-in-from-right-8 duration-500" style={{ animationDelay: `${idxValue * 100}ms` }}>
                    <div className="h-14 w-14 rounded-3xl bg-muted/40 border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                      📦
                    </div>
                    <div className="ml-5 flex-1 min-w-0 space-y-1">
                      <p className="text-base font-black leading-none group-hover:text-primary transition-colors tracking-tight">{sale.userName}</p>
                      <div className="flex items-center gap-2">
                         <Badge variant="outline" className="text-[9px] font-black h-5 px-2 border-primary/20 bg-primary/[0.03] text-primary rounded-lg">
                           <Store className="h-2 w-2 mr-1.5" /> {sale.branchName}
                         </Badge>
                         <span className="text-[10px] font-bold text-muted-foreground opacity-50 uppercase tracking-tighter">
                            {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} น.
                         </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <span className="font-black text-xl tracking-tighter text-emerald-600 dark:text-emerald-400">฿{sale.totalAmount.toLocaleString()}</span>
                       <div className="h-1 w-8 bg-emerald-500/20 rounded-full" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-80 flex flex-col items-center justify-center text-muted-foreground gap-6 opacity-30 italic font-black uppercase tracking-[0.3em] text-center">
                   <div className="h-20 w-20 border-4 border-dashed border-muted-foreground rounded-full flex items-center justify-center scale-x-[-1]">
                      <Activity className="h-10 w-10" />
                   </div>
                   <p className="text-sm">No Recent Data Available</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card to-transparent pt-12">
             <Button variant="outline" className="w-full rounded-[1.2rem] h-14 font-black text-[10px] uppercase tracking-[0.2em] border-2 border-primary/10 hover:bg-primary/[0.03] active:scale-95 transition-all">
                Full Transaction History
             </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
