"use client"

import { useState } from "react"
import { useData } from "@/data/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { 
  Plus, 
  MapPin, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Search,
  Store // Added Store icon
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog"
import { ImageUpload } from "@/components/ui/image-upload"

export default function BranchesPage() {
  const { branches, addBranch, deleteBranch, isLoading } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null)
  
  // New Branch Form State
  const [newName, setNewName] = useState("")
  const [newCode, setNewCode] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newImage, setNewImage] = useState("")

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddBranch = async () => {
    if (!newName || !newCode) {
      toast.error("กรุณากรอกชื่อและรหัสสาขาให้ครบถ้วน")
      return
    }
    
    try {
      await addBranch({ name: newName, code: newCode, location: newLocation, image: newImage })
      setIsAddModalOpen(false)
      setNewName("")
      setNewCode("")
      setNewLocation("")
      setNewImage("")
      toast.success("เพิ่มสาขาสำเร็จ")
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มสาขา")
    }
  }

  const handleDelete = async () => {
    if (!branchToDelete) return
    setIsDeleting(true)
    try {
      await deleteBranch(branchToDelete)
      toast.success("ลบสาขาสำเร็จ")
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการลบสาขา")
    } finally {
      setIsDeleting(false)
      setBranchToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">การจัดการสาขา</h2>
          <p className="text-muted-foreground">
            จัดการสาขาย่อย คลังสินค้า และติดตามผลการดำเนินงานของแต่ละร้าน
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              เพิ่มสาขาใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>เพิ่มสาขาใหม่</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลเบื้องต้นของสาขาเพื่อเริ่มต้นการจัดการ
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                 <ImageUpload 
                    value={newImage}
                    onChange={setNewImage}
                    onRemove={() => setNewImage("")}
                 />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">ชื่อสาขา</Label>
                <Input 
                  id="name" 
                  placeholder="เช่น สาขายูเนี่ยนมอลล์" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">รหัสสาขา</Label>
                <Input 
                  id="code" 
                  placeholder="เช่น BR-010" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">ที่ตั้ง / รายละเอียด</Label>
                <Input 
                  id="location" 
                  placeholder="ลาดพร้าว, กรุงเทพฯ" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>ยกเลิก</Button>
              <Button onClick={handleAddBranch}>บันทึกสาขา</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle>รายการสาขาทั้งหมด</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสาขาหรือรหัส..."
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
                <TableHead className="w-[100px] px-6">รหัส</TableHead>
                <TableHead className="px-6">ชื่อสาขา</TableHead>
                <TableHead className="px-6">ที่ตั้ง</TableHead>
                <TableHead className="px-6 text-right">ดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    {isLoading ? "กำลังโหลดข้อมูล..." : "ไม่พบข้อมูลสาขา"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBranches.map((branch) => (
                  <TableRow key={branch.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell className="font-mono text-xs px-6">
                      <Badge variant="outline" className="font-medium">{branch.code}</Badge>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 min-w-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border/50">
                        {branch.image ? (
                            <Image src={branch.image} alt={branch.name} fill className="object-cover" unoptimized />
                        ) : (
                            <Store className="h-5 w-5 opacity-30" />
                        )}
                        </div>
                        <div className="font-medium group-hover:text-primary transition-colors">{branch.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {branch.location || "ไม่ได้ระบุ"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/branches/${branch.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            ดูรายละเอียด
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => setBranchToDelete(branch.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              ลบสาขา
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
        open={!!branchToDelete}
        onOpenChange={(open) => !open && setBranchToDelete(null)}
        onConfirm={handleDelete}
        title="ยืนยันการลบสาขา"
        description="คุณแน่ใจว่าต้องการลบสาขานี้? ข้อมูลสาขาจะหายไปจากระบบ (ลบได้เฉพาะสาขาที่ไม่มีสต๊อกสินค้าค้างอยู่)"
      />
    </div>
  )
}
