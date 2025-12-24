"use client"

import { useState, useEffect } from "react"
import { useData } from "@/data/data-context"
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
import { Plus, Pencil } from "lucide-react"

interface ProductFormProps {
  product?: any; // If provided, edit mode
  trigger?: React.ReactNode;
}

export function ProductForm({ product, trigger }: ProductFormProps) {
  const { addProduct, updateProduct, categories } = useData();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    costPrice: "",
    sku: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        price: product.price.toString(),
        costPrice: product.costPrice.toString(),
        sku: product.sku,
      });
    } else {
      setFormData({
        name: "",
        categoryId: "",
        price: "",
        costPrice: "",
        sku: "",
      });
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      sku: formData.sku || `SKU-${Date.now()}`, // Fallback auto-gen
      status: 'มีสินค้า' as const, // Default status
    };

    if (product) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มสินค้าใหม่
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</DialogTitle>
          <DialogDescription>
            กรอกรายละเอียดสินค้าด้านล่าง คลิกบันทึกเมื่อเสร็จสิ้น
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                รหัสสินค้า (SKU)
              </Label>
              <Input 
                id="sku" 
                value={formData.sku} 
                onChange={e => setFormData({...formData, sku: e.target.value})}
                placeholder="PROD-XXXXX (เว้นว่าง Auto)" 
                className="col-span-3" 
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                ชื่อสินค้า
              </Label>
              <Input 
                id="name" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="เช่น เมาส์ไร้สาย" 
                className="col-span-3" 
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                หมวดหมู่
              </Label>
              <div className="col-span-3">
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={val => setFormData({...formData, categoryId: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                ราคาขาย
              </Label>
              <Input 
                id="price" 
                type="number" 
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="0.00" 
                className="col-span-3" 
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                ต้นทุน
              </Label>
              <Input 
                 id="cost" 
                 type="number" 
                 value={formData.costPrice}
                 onChange={e => setFormData({...formData, costPrice: e.target.value})}
                 placeholder="0.00" 
                 className="col-span-3" 
              />
            </div>

          </div>
          <DialogFooter>
            <Button type="submit">บันทึกข้อมูล</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
