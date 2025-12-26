"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/data/data-context"
import { useLanguage } from "@/data/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog"

export default function CategoriesPage() {
  const router = useRouter()
  const { categories, deleteCategory } = useData();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string, name: string) => {
    setCategoryToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
      } catch (error: any) {
        console.error('Failed to delete category:', error);
        alert(error.message || 'เกิดข้อผิดพลาดในการลบหมวดหมู่');
      }
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">หมวดหมู่สินค้า (Categories)</h2>
          <p className="text-muted-foreground">
            จัดการหมวดหมู่สินค้าในระบบ
          </p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/categories/add')} 
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มหมวดหมู่
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-card/50 p-4 shadow-sm backdrop-blur-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ค้นหาหมวดหมู่..." 
            className="pl-8 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead>รหัส (Code)</TableHead>
              <TableHead>ชื่อหมวดหมู่ (Name)</TableHead>
              <TableHead className="text-right">จัดการ (Action)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.code}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteClick(category.id, category.name)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  ไม่พบข้อมูลหมวดหมู่
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="ยืนยันการลบหมวดหมู่"
        description="คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้? หากมีสินค้าใช้หมวดหมู่นี้อยู่ จะไม่สามารถลบได้"
        itemName={categoryToDelete?.name}
      />
    </div>
  )
}
