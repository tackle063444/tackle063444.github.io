import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  MapPin, 
  Bell, 
  Shield, 
  Database,
  Globe
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage system preferences and configurations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-col space-y-1">
          <Button variant="ghost" className="justify-start bg-slate-100 dark:bg-slate-800 font-semibold">
             <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button variant="ghost" className="justify-start">
             <MapPin className="mr-2 h-4 w-4" /> Branches
          </Button>
          <Button variant="ghost" className="justify-start">
             <Shield className="mr-2 h-4 w-4" /> Roles & Permissions
          </Button>
          <Button variant="ghost" className="justify-start">
             <Bell className="mr-2 h-4 w-4" /> Notifications
          </Button>
          <Button variant="ghost" className="justify-start">
             <Database className="mr-2 h-4 w-4" /> Backup & Data
          </Button>
        </nav>

        <div className="grid gap-6">
           {/* Profile Settings */}
           <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm">
             <CardHeader>
               <CardTitle>Profile Information</CardTitle>
               <CardDescription>Update your account's profile information and email address.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="grid gap-2">
                 <Label htmlFor="name">Name</Label>
                 <Input id="name" defaultValue="Administrator" />
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="email">Email</Label>
                 <Input id="email" defaultValue="admin@sp-system.com" />
               </div>
               <div className="grid gap-2">
                  <Label>Language</Label>
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm" className="border-primary text-primary bg-primary/5">English</Button>
                     <Button variant="outline" size="sm">Thai</Button>
                  </div>
               </div>
             </CardContent>
             <div className="flex items-center p-6 pt-0">
               <Button>Save Changes</Button>
             </div>
           </Card>

           {/* System Preferences */}
             <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm">
             <CardHeader>
               <CardTitle>System Preferences</CardTitle>
               <CardDescription>Customize global system behavior.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme for the dashboard.</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-generate Product SKU</Label>
                    <p className="text-sm text-muted-foreground">Automatically generate SKUs when creating new products.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications when stock is low.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
