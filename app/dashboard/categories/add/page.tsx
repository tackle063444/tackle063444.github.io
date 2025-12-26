"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/data/data-context"
import { FormLayout } from "@/components/dashboard/form-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function AddCategoryPage() {
  const router = useRouter()
  const { addCategory } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await addCategory(formData)
      router.push('/dashboard/categories')
    } catch (error) {
      console.error('Failed to add category:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormLayout
      title="เพิ่มหมวดหมู่ใหม่"
      description="กรอกข้อมูลหมวดหมู่สินค้าด้านล่าง"
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
            บันทึกข้อมูล
          </Button>
        </div>
      </form>
    </FormLayout>
  )
}
