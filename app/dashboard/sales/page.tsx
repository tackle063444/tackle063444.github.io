import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ScanBarcode,
  CreditCard
} from "lucide-react"

// Mock Products
const posProducts = [
  { id: "PROD-001", name: "Wireless Mouse", price: 1290, color: "bg-blue-500" },
  { id: "PROD-002", name: "Keyboard RGB", price: 3500, color: "bg-purple-500" },
  { id: "PROD-003", name: "Headset 7.1", price: 1590, color: "bg-emerald-500" },
  { id: "PROD-004", name: "Monitor 24\"", price: 4500, color: "bg-orange-500" },
  { id: "PROD-005", name: "USB-C Hub", price: 890, color: "bg-slate-500" },
  { id: "PROD-006", name: "Desk Mat", price: 590, color: "bg-indigo-500" },
]

export default function SalesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6 md:flex-row animate-in fade-in duration-500">
      
      {/* Left: Product Grid */}
      <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
           <div className="relative w-full max-w-sm">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search product..." 
               className="pl-8 bg-white dark:bg-slate-900"
             />
           </div>
           <Button variant="outline" size="icon">
             <ScanBarcode className="h-4 w-4" />
           </Button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {posProducts.map((p) => (
                <Card key={p.id} className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md border-slate-200/60 dark:border-slate-800">
                  <div className={`h-32 w-full ${p.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center rounded-t-lg`}>
                     <div className={`h-16 w-16 rounded-full ${p.color} flex items-center justify-center text-white/90 font-bold shadow-lg`}>
                        {p.name.charAt(0)}
                     </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{p.name}</h3>
                    <p className="text-sm text-indigo-600 font-bold dark:text-indigo-400">
                      ฿{p.price.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
           </div>
        </div>
      </div>

      {/* Right: Cart */}
      <Card className="w-full md:w-96 flex flex-col h-full border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2">
             <ShoppingCart className="h-5 w-5 text-primary" /> Current Order
          </CardTitle>
          <CardDescription>Order #1024 - Walk-in Customer</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Cart Item 1 */}
          <div className="flex items-center justify-between space-x-4">
             <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Wireless Mouse</p>
                <p className="text-xs text-muted-foreground">฿1,290 / unit</p>
             </div>
             <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-6 w-6 rounded-full"><Minus className="h-3 w-3" /></Button>
                <span className="text-sm font-bold w-4 text-center">2</span>
                <Button variant="outline" size="icon" className="h-6 w-6 rounded-full"><Plus className="h-3 w-3" /></Button>
             </div>
             <div className="w-16 text-right font-medium text-sm">
                ฿2,580
             </div>
          </div>
          
           {/* Cart Item 2 */}
           <div className="flex items-center justify-between space-x-4">
             <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Keyboard RGB</p>
                <p className="text-xs text-muted-foreground">฿3,500 / unit</p>
             </div>
             <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-6 w-6 rounded-full"><Minus className="h-3 w-3" /></Button>
                <span className="text-sm font-bold w-4 text-center">1</span>
                <Button variant="outline" size="icon" className="h-6 w-6 rounded-full"><Plus className="h-3 w-3" /></Button>
             </div>
             <div className="w-16 text-right font-medium text-sm">
                ฿3,500
             </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col border-t pt-4 gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-b-lg">
           <div className="w-full space-y-2">
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">Subtotal</span>
               <span>฿6,080.00</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">Tax (7%)</span>
               <span>฿425.60</span>
             </div>
             <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed">
               <span>Total</span>
               <span className="text-primary">฿6,505.60</span>
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                 <Trash2 className="h-4 w-4 mr-2" /> Clear
              </Button>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                 <CreditCard className="h-4 w-4 mr-2" /> Pay
              </Button>
           </div>
        </CardFooter>
      </Card>

    </div>
  )
}
