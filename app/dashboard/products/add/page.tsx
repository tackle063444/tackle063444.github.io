"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/data/data-context"
import { FormLayout } from "@/components/dashboard/form-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

export default function AddProductPage() {
  const router = useRouter()
  const { addProduct, categories } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    costPrice: "",
    sku: "",
    imageUrl: "",
    inventory: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        inventory: parseInt(formData.inventory) || 0,
        sku: formData.sku || `PROD-${Date.now()}`,
        imageUrl: formData.imageUrl,
        status: 'มีสินค้า' as const,
      }

      await addProduct(payload)
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Failed to add product:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormLayout
      title="เพิ่มสินค้าใหม่"
      description="กรอกรายละเอียดสินค้าด้านล่าง"
      backUrl="/dashboard/products"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload */}
        <div className="space-y-2">
            <Label>รูปภาพสินค้า</Label>
            <ImageUpload 
                value={formData.imageUrl} 
                onChange={(url) => setFormData({...formData, imageUrl: url})}
                onRemove={() => setFormData({...formData, imageUrl: ""})}
            />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="sku">
              รหัสสินค้า (SKU)
              <span className="text-xs text-muted-foreground ml-2">
                (เว้นว่างเพื่อสร้างอัตโนมัติ)
              </span>
            </Label>
            <Input 
              id="sku" 
              value={formData.sku} 
              onChange={e => setFormData({...formData, sku: e.target.value})}
              placeholder="PROD-XXXXX" 
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              ชื่อสินค้า <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="เช่น เมาส์ไร้สาย" 
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              หมวดหมู่ <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={val => setFormData({...formData, categoryId: val})}
              required
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

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              ราคาขาย (฿) <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="price" 
              type="number" 
              step="0.01"
              required
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              placeholder="0.00" 
            />
          </div>

          {/* Cost Price */}
          <div className="space-y-2">
            <Label htmlFor="cost">
              ต้นทุน (฿)
            </Label>
            <Input 
              id="cost" 
              type="number" 
              step="0.01"
              value={formData.costPrice}
              onChange={e => setFormData({...formData, costPrice: e.target.value})}
              placeholder="0.00" 
            />
          </div>

          {/* Central Inventory */}
          <div className="space-y-2">
            <Label htmlFor="inventory">
              สต๊อกกลาง (ชิ้น)
            </Label>
            <Input 
              id="inventory" 
              type="number" 
              value={formData.inventory}
              onChange={e => setFormData({...formData, inventory: e.target.value})}
              placeholder="0" 
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/products')}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            บันทึกข้อมูล
          </Button>
        </div>
      </form>
    </FormLayout>
  )
}
