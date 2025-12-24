"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Download, Calendar } from "lucide-react";
import { useLanguage } from "@/data/language-context"

// Mock Data
const data = [
  { name: 'Mo', revenue: 4000, profit: 2400 },
  { name: 'Tu', revenue: 3000, profit: 1398 },
  { name: 'We', revenue: 2000, profit: 9800 },
  { name: 'Th', revenue: 2780, profit: 3908 },
  { name: 'Fr', revenue: 1890, profit: 4800 },
  { name: 'Sa', revenue: 2390, profit: 3800 },
  { name: 'Su', revenue: 3490, profit: 4300 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Furniture', value: 300 },
  { name: 'Accessories', value: 300 },
  { name: 'Clothing', value: 200 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function ReportsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.reports}</h2>
          <p className="text-muted-foreground">
            Analyze performance and insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-background/50">
            <Calendar className="mr-2 h-4 w-4" />
            Jan 20, 2024 - Feb 09, 2024
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border bg-card/50 shadow-sm backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Revenue vs Profit</CardTitle>
            <CardDescription>
              Daily comparison.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `฿${value}`} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid hsl(var(--border))', 
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-border bg-card/50 shadow-sm backdrop-blur-sm">
           <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Sales distribution.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text for Donut chart */}
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                   <span className="text-2xl font-bold">1,200</span>
                   <span className="text-xs text-muted-foreground">{t.total}</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="border-border bg-card/50 shadow-sm backdrop-blur-sm">
           <CardHeader>
             <CardTitle className="text-lg">Top Selling</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             {[1,2,3,4,5].map((i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      #{i}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Product {i}</p>
                      <p className="text-xs text-muted-foreground">Category A</p>
                    </div>
                 </div>
                 <div className="text-sm font-bold">฿12,450</div>
               </div>
             ))}
           </CardContent>
         </Card>

         <Card className="border-border bg-card/50 shadow-sm backdrop-blur-sm">
           <CardHeader>
             <CardTitle className="text-lg">Top Branch</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             {[1,2,3].map((i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600">
                      #{i}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Branch {i}</p>
                      <p className="text-xs text-muted-foreground">Bangkok</p>
                    </div>
                 </div>
                 <div className="text-sm font-bold">฿85,200</div>
               </div>
             ))}
           </CardContent>
         </Card>

         <Card className="border-border bg-card/50 shadow-sm backdrop-blur-sm">
           <CardHeader>
             <CardTitle className="text-lg">Alerts</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             {[1,2,3,4].map((i) => (
               <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2 w-2 rounded-full ${i%2===0 ? 'bg-destructive' : 'bg-yellow-500'}`} />
                  <div>
                    <p className="text-sm font-medium">{i%2===0 ? t.outOfStock : t.lowStockAlert}</p>
                    <p className="text-xs text-muted-foreground">Item ID-00{i} below threshold</p>
                  </div>
               </div>
             ))}
           </CardContent>
         </Card>
      </div>
    </div>
  )
}
