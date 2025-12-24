import Link from "next/link"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Users,
  LogOut,
  Package2,
  Menu,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-white dark:bg-slate-900 md:flex shadow-sm">
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Package2 className="h-5 w-5" />
            </div>
            <span>SP System</span>
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium space-y-1">
            <div className="pb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overview
              </h3>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </div>
            </div>
            
            <div className="pb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Management
              </h3>
              <div className="space-y-1">
                <Link
                  href="/dashboard/products"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <Link
                  href="/dashboard/inventory"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                >
                  <Users className="h-4 w-4" /> {/* Should be Box or something, using Users as placeholder */}
                  Inventory
                </Link>
                <Link
                  href="/dashboard/sales"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Sales (POS)
                </Link>
              </div>
            </div>

            <div className="pb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System
              </h3>
              <div className="space-y-1">
                <Link
                  href="/dashboard/users"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                >
                  <Users className="h-4 w-4" />
                  Staff
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="border-t p-4">
           <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
             <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold dark:bg-indigo-900 dark:text-indigo-100">
               AD
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="truncate text-sm font-medium">Admin User</p>
               <p className="truncate text-xs text-muted-foreground">Admin Branch A</p>
             </div>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <LogOut className="h-4 w-4" />
             </Button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300 ease-in-out">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md dark:bg-slate-900/80 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold md:text-xl">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
             </Button>
          </div>
        </header>
        
        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 pt-6 w-full max-w-7xl mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}
