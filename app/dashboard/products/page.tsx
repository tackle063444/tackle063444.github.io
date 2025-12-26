"use client"

import { useState } from "react"
import { useData } from "@/data/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Package,
  Layers,
  Tag
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog"
import { toast } from "sonner"

export default function ProductsPage() {
  const { products, deleteProduct, isLoading } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await deleteProduct(productToDelete)
      toast.success("ลบสินค้าสำเร็จ")
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการลบสินค้า")
    } finally {
      setIsDeleting(false)
      setProductToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">จัดการสินค้า</h2>
          <p className="text-muted-foreground">
            จัดการรายการสินค้า ราคา และหมวดหมู่ทั้งหมดในระบบ
          </p>
        </div>
        <Button asChild className="gap-2 shadow-sm">
          <Link href="/dashboard/products/add">
            <Plus className="h-4 w-4" />
            เพิ่มสินค้าใหม่
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle>รายการสินค้าทั้งหมด ({filteredProducts.length})</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหาตามชื่อ หรือ SKU..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px] px-6">รูปภาพ</TableHead>
                <TableHead className="px-6">รหัสสินค้า (SKU)</TableHead>
                <TableHead className="px-6">ชื่อสินค้า</TableHead>
                <TableHead className="px-6">หมวดหมู่</TableHead>
                <TableHead className="px-6 text-right">ราคาขาย</TableHead>
                <TableHead className="px-6 text-right">สต๊อกกลาง</TableHead>
                <TableHead className="px-6 text-right">ดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    {isLoading ? "กำลังโหลดข้อมูล..." : "ไม่พบรายการสินค้า"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell className="px-6 py-4">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted border border-border/50">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground">
                            <Package className="h-5 w-5 opacity-50" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs px-6 font-medium">
                      {product.sku}
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        ทุน: ฿{product.costPrice?.toLocaleString() || "0"}
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge variant="secondary" className="font-normal">
                        {product.category?.name || "ไม่ระบุ"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6 font-bold text-primary">
                      ฿{product.basePrice?.toLocaleString()}
                    </TableCell>
                     <TableCell className="text-right px-6">
                      {/* TODO: Show Central Inventory Stock */}
                      <Badge variant="outline" className="font-mono">
                        {product.inventory || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => setProductToDelete(product.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              ลบสินค้า
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog 
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        onConfirm={handleDelete}
        title="ยืนยันการลบสินค้า"
        description="คุณแน่ใจว่าต้องการลบสินค้านี้? ข้อมูลการขายและสต๊อกที่เกี่ยวข้องอาจได้รับผลกระทบ"
      />
    </div>
  )
}
