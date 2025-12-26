"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useData } from "@/data/data-context"
import { FormLayout } from "@/components/dashboard/form-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  
  const { updateCategory, getCategoryById } = useData()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  })

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const category = await getCategoryById(categoryId)
        if (category) {
          setFormData({
            name: category.name,
            code: category.code,
          })
        } else {
          alert('ไม่พบข้อมูลหมวดหมู่')
          router.push('/dashboard/categories')
        }
      } catch (error) {
        console.error('Failed to load category:', error)
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
        router.push('/dashboard/categories')
      } finally {
        setIsLoading(false)
      }
    }

    loadCategory()
  }, [categoryId, getCategoryById, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await updateCategory(categoryId, formData)
      router.push('/dashboard/categories')
    } catch (error) {
      console.error('Failed to update category:', error)
      alert('เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่')
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
      title="แก้ไขหมวดหมู่"
      description="แก้ไขข้อมูลหมวดหมู่สินค้าด้านล่าง"
      backUrl="/dashboard/categories"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              รหัสหมวดหมู่ <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="code" 
              required
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
              placeholder="เช่น ELEC" 
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              ชื่อหมวดหมู่ <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="เช่น อุปกรณ์ไอที" 
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/categories')}
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
