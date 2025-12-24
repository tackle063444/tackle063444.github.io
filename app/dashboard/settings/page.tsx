"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">การตั้งค่า (Settings)</h2>
        <p className="text-muted-foreground">
          จัดการโปรไฟล์ และการตั้งค่าระบบ
        </p>
      </div>
      <Separator className="my-6" />
      
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 overflow-x-auto pb-4 lg:pb-0 px-4">
             {['โปรไฟล์', 'สาขา', 'สิทธิ์การใช้งาน', 'การแจ้งเตือน', 'สำรองข้อมูล'].map((item, i) => (
                <Button 
                  key={i} 
                  variant={i === 0 ? "secondary" : "ghost"} 
                  className="justify-start whitespace-nowrap"
                >
                  {item}
                </Button>
             ))}
          </nav>
        </aside>
        
        <div className="flex-1 lg:max-w-2xl">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">โปรไฟล์ (Profile)</h3>
              <p className="text-sm text-muted-foreground">
                ข้อมูลส่วนตัวและการแสดงผลของคุณ
              </p>
            </div>
            <Separator />
            
            <div className="space-y-4">
               <div className="grid gap-2">
                 <Label htmlFor="name">ชื่อที่แสดง</Label>
                 <Input id="name" defaultValue="แอดมิน (Admin)" />
                 <p className="text-[0.8rem] text-muted-foreground">
                   นี่คือชื่อที่จะแสดงในหน้า Dashboard และบิลขาย
                 </p>
               </div>

               <div className="grid gap-2">
                 <Label htmlFor="email">อีเมล</Label>
                 <Input id="email" type="email" defaultValue="admin@sp-system.com" disabled />
               </div>

               <div className="grid gap-2">
                 <Label htmlFor="language">ภาษา</Label>
                 <select 
                    id="language" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                 >
                    <option value="th">ไทย (Thai)</option>
                    <option value="en">English (อังกฤษ)</option>
                 </select>
               </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">การตั้งค่าระบบ (Preferences)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">รหัสสินค้าอัตโนมัติ (Auto-generate SKU)</Label>
                      <p className="text-sm text-muted-foreground">
                        สร้างรหัสสินค้าอัตโนมัติเมื่อเพิ่มสินค้าใหม่
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">แจ้งเตือนสินค้าใกล้หมด (Low Stock Alerts)</Label>
                      <p className="text-sm text-muted-foreground">
                        ส่งอีเมลแจ้งเตือนเมื่อสินค้าต่ำกว่าจุดสั่งซื้อ
                      </p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700">บันทึกการเปลี่ยนแปลง</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
