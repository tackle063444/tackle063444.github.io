"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const { updateProduct, getProductById, categories } = useData()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    costPrice: "",
    sku: "",
    imageUrl: "",
  })

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await getProductById(productId)
        if (product) {
          setFormData({
            name: product.name,
            categoryId: product.categoryId,
            price: product.price.toString(),
            costPrice: product.costPrice.toString(),
            sku: product.sku,
            imageUrl: product.imageUrl || "",
          })
        } else {
          alert('ไม่พบข้อมูลสินค้า')
          router.push('/dashboard/products')
        }
      } catch (error) {
        console.error('Failed to load product:', error)
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
        router.push('/dashboard/products')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId, getProductById, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        sku: formData.sku,
        imageUrl: formData.imageUrl,
      }

      await updateProduct(productId, payload)
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('เกิดข้อผิดพลาดในการแก้ไขสินค้า')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <FormLayout
      title="แก้ไขสินค้า"
      description="แก้ไขรายละเอียดสินค้าด้านล่าง"
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
            บันทึกการแก้ไข
          </Button>
        </div>
      </form>
    </FormLayout>
  )
}
