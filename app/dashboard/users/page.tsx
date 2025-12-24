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
  Plus, 
  Search, 
  MoreHorizontal, 
  UserPlus,
  ShieldCheck,
  ShieldAlert
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock users
const users = [
  { id: "USR-001", name: "Admin User", email: "admin@sp-system.com", role: "ADMIN", branch: "All Branches", status: "Active" },
  { id: "USR-002", name: "Somchai Manager", email: "somchai@sp-system.com", role: "MANAGER", branch: "Siam Paragon", status: "Active" },
  { id: "USR-003", name: "Somsri Staff", email: "somsri@sp-system.com", role: "STAFF", branch: "Siam Paragon", status: "Active" },
  { id: "USR-004", name: "John Doe", email: "john@sp-system.com", role: "STAFF", branch: "Central World", status: "Inactive" },
]

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage system access, roles, and staff members.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 border-slate-200/60 dark:border-slate-800">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8 bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800"
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>User Information</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch Access</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                        ${user.role === 'ADMIN' ? 'border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' : 
                          user.role === 'MANAGER' ? 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                          'border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}
                    `}>
                        {user.role}
                    </Badge>
                </TableCell>
                <TableCell className="text-sm">{user.branch}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center text-xs font-medium ${
                    user.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-slate-500'
                  }`}>
                    <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'
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
