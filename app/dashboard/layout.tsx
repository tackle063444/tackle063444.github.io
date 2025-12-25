"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

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
  Bell,
  Box,
  Languages,
  Tags,
  Building2,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { SidebarItem } from "@/components/dashboard/sidebar-item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LanguageProvider, useLanguage } from "@/data/language-context"
import { DataProvider } from "@/data/data-context"

// Simple mock user for display -> Removed, using session instead

// Separate component to use the context hook
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { lang, setLang, t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return null; // Or a loading spinner

  const user = session?.user;
  const isAdmin = user?.role === 'ADMIN';

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
       <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-transparent dark:border-border">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Package2 className="h-5 w-5" />
            </div>
            <span>SP System</span>
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium space-y-1">
            <div className="pb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t.overview}
              </h3>
              <div className="space-y-1">
                <SidebarItem href="/dashboard" icon={LayoutDashboard} title={t.dashboard} />
                <SidebarItem href="/dashboard/reports" icon={BarChart3} title={t.reports} />
              </div>
            </div>
            
            <div className="pb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t.management}
              </h3>
              <div className="space-y-1">
                <SidebarItem href="/dashboard/products" icon={Package} title={t.products} />
                <SidebarItem href="/dashboard/categories" icon={Tags} title="หมวดหมู่สินค้า" />
                <SidebarItem href="/dashboard/branches" icon={Building2} title="จัดการสาขา" />
                <SidebarItem href="/dashboard/inventory" icon={Box} title={t.inventory} />
                <SidebarItem href="/dashboard/sales" icon={ShoppingCart} title={t.pos} />
              </div>
            </div>

            <div className="pb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
               {t.system}
              </h3>
              <div className="space-y-1">
                {isAdmin && (
                   <SidebarItem href="/dashboard/users" icon={Users} title={t.staff} />
                )}
                <SidebarItem href="/dashboard/settings" icon={Settings} title={t.settings} />
              </div>
            </div>
          </nav>
        </div>

        {/* Removed bottom profile */}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-background transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card md:flex shadow-sm transition-all duration-300">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300 ease-in-out">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl sticky top-0 z-20 transition-all">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger (Sheet) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-r-0 bg-card">
                 <SidebarContent />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold md:text-xl hidden md:block">
              {t.welcome}, {user?.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 border-r border-border pr-4 h-8">
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm" className="hidden md:flex gap-2 h-8">
                         <Languages className="h-4 w-4" />
                         <span>{lang === 'th' ? 'TH' : 'EN'}</span>
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => setLang('th')}>
                       🇹🇭 ภาษาไทย (TH)
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setLang('en')}>
                       🇬🇧 English (EN)
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
             </div>

             <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
             </Button>

             <div className="h-8 w-px bg-border mx-1" />

             {/* Moved Profile to Header */}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 flex items-center gap-3 rounded-full hover:bg-accent/50 pr-2 pl-1">
                    <Avatar className="h-8 w-8 border border-border shadow-sm">
                      <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-xs hidden sm:flex">
                      <span className="font-semibold leading-none">{user?.name}</span>
                      <span className="text-muted-foreground mt-0.5">{user?.role}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                   <div className="flex items-center justify-start gap-2 p-2">
                     <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium leading-none">{user?.name}</p>
                       <p className="text-xs leading-none text-muted-foreground">
                         {user?.email}
                       </p>
                     </div>
                   </div>
                   <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      บัญชีผู้ใช้
                   </DropdownMenuItem>
                   <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      ออกจากระบบ
                   </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <DataProvider>
        <DashboardContent>{children}</DashboardContent>
      </DataProvider>
    </LanguageProvider>
  )
}
