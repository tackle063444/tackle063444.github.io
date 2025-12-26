"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  User, 
  Settings, 
  Bell, 
  Database, 
  Globe 
} from "lucide-react"
import { useLanguage } from "@/data/language-context"

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          {t.settingsTitle}
        </h2>
        <p className="text-muted-foreground mt-2">
          {t.settingsDesc}
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <aside className="hidden md:block">
          <Card className="border-border bg-card/50 backdrop-blur-sm sticky top-24">
             <CardContent className="p-4 space-y-1">
               <Button variant="ghost" className="w-full justify-start gap-2 bg-accent/50 text-accent-foreground font-medium">
                 <User className="h-4 w-4" />
                 {t.account}
               </Button>
               <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                 <Globe className="h-4 w-4" />
                 Language
               </Button>
               <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                 <Settings className="h-4 w-4" />
                 System
               </Button>
               <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                 <Bell className="h-4 w-4" />
                 Notifications
               </Button>
             </CardContent>
          </Card>
        </aside>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="border-border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
             <CardHeader className="bg-accent/10 border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2">
                   <User className="h-5 w-5 text-primary" />
                   {t.account}
                </CardTitle>
                <CardDescription>
                  Update your account settings and preferences.
                </CardDescription>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                   <div className="space-y-2">
                     <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
                     <Input id="name" defaultValue="แอดมิน (Admin)" className="bg-background/50" />
                     <p className="text-[0.8rem] text-muted-foreground">
                       This is your public display name.
                     </p>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                     <Input id="email" type="email" defaultValue="admin@sp-system.com" disabled className="bg-muted" />
                     <p className="text-[0.8rem] text-muted-foreground">
                        Email cannot be changed directly.
                     </p>
                   </div>
                </div>
             </CardContent>
          </Card>

           {/* Language Section */}
           <Card className="border-border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
             <CardHeader className="bg-accent/10 border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2">
                   <Globe className="h-5 w-5 text-indigo-500" />
                   {t.language}
                </CardTitle>
                <CardDescription>
                  Choose your preferred language for the interface.
                </CardDescription>
             </CardHeader>
             <CardContent className="p-6">
                 <div className="max-w-md space-y-2">
                   <Label htmlFor="language" className="text-sm font-medium">System Language</Label>
                   <select 
                      id="language" 
                      value={lang}
                      onChange={(e) => setLang(e.target.value as any)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                   >
                      <option value="th">🇹🇭 ภาษาไทย (Thai)</option>
                      <option value="en">🇬🇧 English</option>
                   </select>
                 </div>
             </CardContent>
          </Card>

          {/* System Section */}
          <Card className="border-border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardHeader className="bg-accent/10 border-b border-border/50 pb-4">
                 <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-500" />
                    System Preferences
                 </CardTitle>
                 <CardDescription>
                   Manage automated system behaviors.
                 </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4 transition-colors hover:bg-accent/5">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Auto-generate SKU</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically generate product codes when adding new items.
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4 transition-colors hover:bg-accent/5">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">{t.lowStockAlert}</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications when stock is low.
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
              </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-4">
             <Button variant="outline">Cancel</Button>
             <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
