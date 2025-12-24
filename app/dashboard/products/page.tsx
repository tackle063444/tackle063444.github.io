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
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  FileDown
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data
const products = [
  { id: "PROD-0001", name: "Premium Wireless Mouse", category: "Electronics", price: 1290.00, stock: 45, status: "In Stock" },
  { id: "PROD-0002", name: "Mechanical Keyboard RGB", category: "Electronics", price: 3500.00, stock: 12, status: "Low Stock" },
  { id: "PROD-0003", name: "Ergonomic Office Chair", category: "Furniture", price: 8900.00, stock: 4, status: "Critical" },
  { id: "PROD-0004", name: "USB-C Hub Multi-port", category: "Accessories", price: 890.00, stock: 120, status: "In Stock" },
  { id: "PROD-0005", name: "Laptop Stand Aluminum", category: "Accessories", price: 590.00, stock: 0, status: "Out of Stock" },
  { id: "PROD-0006", name: "27\" 4K Monitor", category: "Electronics", price: 12500.00, stock: 8, status: "Low Stock" },
  { id: "PROD-0007", name: "Bluetooth Headset", category: "Audio", price: 1590.00, stock: 30, status: "In Stock" },
]

export default function ProductsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog, prices, and inventory initially.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-lg border bg-white p-4 shadow-sm dark:bg-slate-900 border-slate-200/60 dark:border-slate-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-8 bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Category
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Stock Status
          </Button>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="w-[100px]">SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-muted-foreground text-xs">{product.id}</TableCell>
                <TableCell className="font-semibold">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-md font-normal">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>฿{product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    product.status === 'In Stock' 
                      ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20' 
                      : product.status === 'Low Stock'
                      ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20'
                      : product.status === 'Critical'
                      ? 'bg-orange-50 text-orange-800 ring-orange-600/20 dark:bg-orange-900/10 dark:text-orange-400 dark:ring-orange-500/20'
                      : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-500/20'
                  }`}>
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing 7 of 124 products
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
