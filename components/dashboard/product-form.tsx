"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

export function ProductForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มสินค้าใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดสินค้าด้านล่าง คลิกบันทึกเมื่อเสร็จสิ้น
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              รูปภาพ
            </Label>
            <div className="col-span-3">
               <Input id="image" type="file" className="cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              ชื่อสินค้า
            </Label>
            <Input id="name" placeholder="เช่น เมาส์ไร้สาย" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              หมวดหมู่
            </Label>
            <div className="col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">อิเล็กทรอนิกส์</SelectItem>
                    <SelectItem value="furniture">เฟอร์นิเจอร์</SelectItem>
                    <SelectItem value="clothing">เสื้อผ้า</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              ราคาขาย
            </Label>
            <Input id="price" type="number" placeholder="0.00" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              ต้นทุน
            </Label>
            <Input id="cost" type="number" placeholder="0.00" className="col-span-3" />
          </div>
          
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              สต๊อกเริ่มต้น
            </Label>
            <Input id="stock" type="number" placeholder="0" className="col-span-3" />
          </div>

           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              หน่วยนับ
            </Label>
             <div className="col-span-3">
                <Select defaultValue="piece">
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหน่วยนับ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piece">ชิ้น</SelectItem>
                    <SelectItem value="box">กล่อง</SelectItem>
                    <SelectItem value="pair">คู่</SelectItem>
                    <SelectItem value="set">ชุด</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

        </div>
        <DialogFooter>
          <Button type="submit">บันทึกข้อมูล</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
