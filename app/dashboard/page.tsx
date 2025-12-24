"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  Package, 
  Activity, 
  ArrowUpRight,
  ArrowDownRight,
  CreditCard
} from "lucide-react"
import { useLanguage } from "@/data/language-context"

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Total Revenue */}
        <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                 <ArrowUpRight className="h-3 w-3 mr-0.5" /> 20.1%
              </span>
              {t.compareLastMonth}
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Active Sales */}
        <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.sales}</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                 <ArrowUpRight className="h-3 w-3 mr-0.5" /> 180.1%
              </span>
              {t.compareLastMonth}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Products */}
        <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalStock}</CardTitle>
            <Package className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-rose-500 flex items-center mr-1">
                 <ArrowDownRight className="h-3 w-3 mr-0.5" /> 4%
              </span>
              {t.compareLastMonth}
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Active Users */}
        <Card className="shadow-sm border-border bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.lowStock}</CardTitle>
            <Activity className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items need restock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Recent Sales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Overview Chart */}
        <Card className="col-span-4 shadow-sm border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t.overview}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Mock Chart Area */}
            <div className="h-[240px] w-full flex items-end justify-between px-4 pb-2">
               {[65, 40, 75, 55, 80, 45, 90, 60, 70, 85, 50, 65].map((h, i) => (
                 <div key={i} className="group relative flex flex-col items-center gap-2 w-full">
                    <div 
                      className="w-full max-w-[24px] rounded-t-sm bg-primary/80 transition-all hover:bg-primary hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:h-[105%]"
                      style={{ height: `${h}%` }}
                    ></div>
                    <span className="text-[10px] text-muted-foreground">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                    </span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="col-span-3 shadow-sm border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t.recentSales}</CardTitle>
            <CardDescription>
              265 sales made this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: "คุณสมชาย ใจดี", email: "somchai@email.com", amount: "+฿1,999.00" },
                { name: "คุณวิภาดา รักสวย", email: "wipada@email.com", amount: "+฿39.00" },
                { name: "บริษัท เอบีซี จำกัด", email: "purchase@abc.com", amount: "+฿299.00" },
                { name: "คุณสมศักดิ์", email: "somsak@email.com", amount: "+฿99.00" },
                { name: "ลูกค้าทั่วไป", email: "-", amount: "+฿39.00" }
              ].map((sale, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                    {sale.name.charAt(0)}{sale.name.split(' ')[1]?.charAt(0)}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
