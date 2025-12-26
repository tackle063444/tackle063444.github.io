"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  MoreHorizontal, 
  UserPlus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/data/language-context"

// Mock users
const users = [
  { id: "USR-001", name: "ผู้ดูแลระบบ (Admin)", email: "admin@sp-system.com", role: "ADMIN", branch: "ทุกสาขา", status: "ใช้งาน" },
  { id: "USR-002", name: "สมชาย ผู้จัดการ", email: "somchai@sp-system.com", role: "MANAGER", branch: "สาขาสยาม", status: "ใช้งาน" },
  { id: "USR-003", name: "สมศรี พนักงาน", email: "somsri@sp-system.com", role: "STAFF", branch: "สาขาสยาม", status: "ใช้งาน" },
  { id: "USR-004", name: "จอห์น พนักงาน", email: "john@sp-system.com", role: "STAFF", branch: "สาขาเซ็นทรัล", status: "ระงับ" },
]

export default function UsersPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (session?.user?.role !== "ADMIN") return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.staff}</h2>
          <p className="text-muted-foreground">
            Manage access, roles, and system users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-card/50 p-4 shadow-sm backdrop-blur-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search name or email..." 
            className="pl-8 bg-background/50 border-input"
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-accent/50">
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>User Information</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className={`
                        ${user.role === 'ADMIN' ? 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 
                          user.role === 'MANAGER' ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300'}
                    `}>
                        {user.role}
                    </Badge>
                </TableCell>
                <TableCell className="text-sm">{user.branch}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center text-xs font-medium ${
                    user.status === 'ใช้งาน' ? 'text-green-600 dark:text-green-400' : 'text-slate-500'
                  }`}>
                    <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        user.status === 'ใช้งาน' ? 'bg-green-500' : 'bg-slate-400'
                    }`} />
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
