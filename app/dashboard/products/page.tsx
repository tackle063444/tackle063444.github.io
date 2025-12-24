"use client"

import { useState } from "react"
import { useData } from "@/data/data-context"
import { useLanguage } from "@/data/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  Pencil, 
  Trash2,
  FileDown
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProductForm } from "@/components/dashboard/product-form"

export default function ProductsPage() {
  const { products, categories, deleteProduct, getProductStock } = useData();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || "Uncategorized";
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.productsTitle}</h2>
          <p className="text-muted-foreground">
            {t.productsDesc}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-background hover:bg-accent/50">
            <FileDown className="mr-2 h-4 w-4" />
            {t.export}
          </Button>
          <ProductForm />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-lg border bg-card/50 p-4 shadow-sm backdrop-blur-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t.searchProduct} 
            className="pl-8 bg-background/50 border-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 bg-background/50">
            <Filter className="mr-2 h-4 w-4" />
            {t.category}
          </Button>
          <Button variant="outline" size="sm" className="h-9 bg-background/50">
            <Filter className="mr-2 h-4 w-4" />
            {t.status}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-accent/50">
            <TableRow>
              <TableHead className="w-[100px]">{t.id}</TableHead>
              <TableHead>{t.productName}</TableHead>
              <TableHead>{t.category}</TableHead>
              <TableHead>{t.price}</TableHead>
              <TableHead>{t.stock}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead className="text-right">{t.action}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const totalStock = getProductStock(product.id);
                // Simple status logic based on stock
                const status = totalStock === 0 ? 'สินค้าหมด' : totalStock < 10 ? 'สินค้าใกล้หมด' : 'มีสินค้า';
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-muted-foreground text-xs">{product.sku}</TableCell>
                    <TableCell className="font-semibold">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-md font-normal">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell>฿{product.price.toLocaleString()}</TableCell>
                    <TableCell>{totalStock}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        status === 'มีสินค้า' 
                          ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20' 
                          : status === 'สินค้าใกล้หมด'
                          ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20'
                          : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-500/20'
                      }`}>
                        {status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ProductForm 
                          product={product} 
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          } 
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="h-8 w-8 text-muted-foreground hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
               <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  ไม่พบสินค้า
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
