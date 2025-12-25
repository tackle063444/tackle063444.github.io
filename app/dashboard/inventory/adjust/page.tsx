"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

export default function AdjustInventoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const { updateStock, transferStock, products, branches } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Pre-fill from query params if available
  const preProductId = searchParams.get('productId')
  const preBranchId = searchParams.get('branchId')
  const preQuantity = searchParams.get('quantity')
  
  const [adjustmentType, setAdjustmentType] = useState<'adjust' | 'transfer'>('adjust')
  const [formData, setFormData] = useState({
    branchId: preBranchId || "",
    productId: preProductId || "",
    quantity: preQuantity || "",
    targetBranchId: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const qty = parseInt(formData.quantity)
      
      if (adjustmentType === 'adjust') {
        await updateStock(formData.branchId, formData.productId, qty)
      } else {
        if (!formData.targetBranchId) {
          alert('กรุณาเลือกสาขาปลายทาง')
          setIsSubmitting(false)
          return
        }
        await transferStock(formData.branchId, formData.targetBranchId, formData.productId, qty)
      }
      
      router.push('/dashboard/inventory')
    } catch (error) {
      console.error('Failed to adjust stock:', error)
      alert('เกิดข้อผิดพลาดในการปรับสต๊อก')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormLayout
      title="จัดการสต๊อกสินค้า"
      description="ปรับปรุงยอดคงเหลือ หรือโอนย้ายสินค้าระหว่างสาขา"
      backUrl="/dashboard/inventory"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6">
          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              ประเภทรายการ <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={adjustmentType} 
              onValueChange={(v: any) => setAdjustmentType(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adjust">ปรับยอด (Set Quantity)</SelectItem>
                <SelectItem value="transfer">โอนย้าย (Transfer)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label htmlFor="branch">
              สาขา {adjustmentType === 'transfer' && '(ต้นทาง)'} <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.branchId} 
              onValueChange={val => setFormData({...formData, branchId: val})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสาขา" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product */}
          <div className="space-y-2">
            <Label htmlFor="product">
              สินค้า <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.productId} 
              onValueChange={val => setFormData({...formData, productId: val})}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสินค้า" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Branch (for transfer only) */}
          {adjustmentType === 'transfer' && (
            <div className="space-y-2">
              <Label htmlFor="targetBranch">
                ไปยังสาขา (ปลายทาง) <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.targetBranchId} 
                onValueChange={val => setFormData({...formData, targetBranchId: val})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสาขาปลายทาง" />
                </SelectTrigger>
                <SelectContent>
                  {branches
                    .filter(b => b.id !== formData.branchId)
                    .map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              จำนวน <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="quantity" 
              type="number" 
              min="0"
              required
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
              placeholder={adjustmentType === 'adjust' ? 'ระบุจำนวนที่ต้องการตั้ง' : 'ระบุจำนวนที่ต้องการโอน'}
            />
            <p className="text-xs text-muted-foreground">
              {adjustmentType === 'adjust' 
                ? 'ระบบจะตั้งยอดคงเหลือเป็นจำนวนที่ระบุ' 
                : 'ระบบจะลดจำนวนจากสาขาต้นทาง และเพิ่มให้สาขาปลายทาง'
              }
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/inventory')}
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
