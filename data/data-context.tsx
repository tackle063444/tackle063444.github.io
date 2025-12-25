"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Branch {
  id: string;
  name: string;
  code: string;
  location?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  code: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  price: number;
  basePrice: number;
  costPrice: number;
  status: string;
  imageUrl?: string;
  inventory?: number; // Central Stock
}

export interface Stock {
  id: string;
  productId: string;
  branchId: string;
  quantity: number;
  reorderPoint: number;
}

interface DataContextType {
  branches: Branch[];
  categories: Category[];
  products: Product[];
  stocks: Stock[];
  isLoading: boolean;
  
  refresh: () => Promise<void>;

  addCategory: (category: { name: string, code: string }) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Promise<Category | null>;
  
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  
  addBranch: (branch: { name: string, code: string, location?: string, image?: string }) => Promise<void>;
  updateBranch: (id: string, branch: Partial<Branch>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  getBranchById: (id: string) => Promise<any | null>; // Returns branch + stocks

  updateStock: (branchId: string, productId: string, quantity: number) => Promise<void>;
  adjustStock: (branchId: string, productId: string, adjustment: number) => Promise<void>;
  addStockToBranch: (branchId: string, productId: string, quantity: number) => Promise<void>;
  transferStock: (fromBranchId: string, toBranchId: string, productId: string, quantity: number) => Promise<void>;
  
  getStocksByBranch: (branchId: string) => Stock[];
  getProductStock: (productId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    // Keep loading true only on initial load to avoid flickering, or handle it UI side
    // For now, let's not block UI on refresh if data exists
    if (products.length === 0) setIsLoading(true);
    
    try {
        const [resBranches, resCategories, resProducts, resStocks] = await Promise.all([
            fetch('/api/branches'),
            fetch('/api/categories'),
            fetch('/api/products'),
            fetch('/api/inventory')
        ]);
        
        if (resBranches.ok) setBranches(await resBranches.json());
        if (resCategories.ok) setCategories(await resCategories.json());
        if (resProducts.ok) setProducts(await resProducts.json());
        if (resStocks.ok) setStocks(await resStocks.json());
        
    } catch (error) {
        console.error("Failed to fetch data", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addBranch = async (data: { name: string, code: string, location?: string, image?: string }) => {
    try {
        await fetch('/api/branches', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        refresh();
    } catch (e) {
        console.error(e);
    }
  };

  const updateBranch = async (id: string, data: Partial<Branch>) => {
      try {
          const res = await fetch(`/api/branches/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error('Failed to update branch');
          refresh();
      } catch (e) {
          console.error(e);
          throw e;
      }
  };

  const deleteBranch = async (id: string) => {
      try {
          const res = await fetch(`/api/branches/${id}`, {
              method: 'DELETE',
          });
          if (!res.ok) {
              const error = await res.json();
              throw new Error(error.error || 'Failed to delete branch');
          }
          refresh();
      } catch (e) {
          console.error(e);
          throw e;
      }
  };

  const getBranchById = async (id: string): Promise<any | null> => {
      try {
          const res = await fetch(`/api/branches/${id}`);
          if (!res.ok) return null;
          return await res.json();
      } catch (e) {
          console.error(e);
          return null;
      }
  };

  const addCategory = async (data: { name: string, code: string }) => {
    try {
        await fetch('/api/categories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        refresh();
    } catch (e) {
        console.error(e);
    }
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
      try {
          const res = await fetch(`/api/categories/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error('Failed to update category');
          refresh();
      } catch (e) {
          console.error(e);
          throw e;
      }
  };
  
  const deleteCategory = async (id: string) => {
      try {
          const res = await fetch(`/api/categories/${id}`, {
              method: 'DELETE',
          });
          if (!res.ok) {
              const error = await res.json();
              throw new Error(error.error || 'Failed to delete category');
          }
          refresh();
      } catch (e) {
          console.error(e);
          throw e;
      }
  };

  const getCategoryById = async (id: string): Promise<Category | null> => {
      try {
          const res = await fetch(`/api/categories/${id}`);
          if (!res.ok) return null;
          return await res.json();
      } catch (e) {
          console.error(e);
          return null;
      }
  };

  const addProduct = async (data: any) => {
    try {
        await fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        refresh();
    } catch (e) {
        console.error(e);
    }
  }

  const updateProduct = async (id: string, data: Partial<Product>) => {
      try {
          const res = await fetch(`/api/products/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error('Failed to update product');
          refresh();
      } catch (e) {
          console.error(e);
          throw e;
      }
  }
  
  const deleteProduct = async (id: string) => {
      try {
          const res = await fetch(`/api/products/${id}`, {
              method: 'DELETE',
          });
          if (!res.ok) throw new Error('Failed to delete product');
          refresh();
      } catch (e) {
          console.error(e);
          throw e;
      }
  }

  const getProductById = async (id: string): Promise<Product | null> => {
      try {
          const res = await fetch(`/api/products/${id}`);
          if (!res.ok) return null;
          return await res.json();
      } catch (e) {
          console.error(e);
          return null;
      }
  };

  const updateStock = async (branchId: string, productId: string, quantity: number) => {
      try {
          await fetch('/api/inventory', {
              method: 'POST',
              body: JSON.stringify({
                  action: 'SET',
                  branchId,
                  productId,
                  quantity
              })
          });
          refresh();
      } catch (e) {
          console.error(e);
      }
  };

  const adjustStock = async (branchId: string, productId: string, adjustment: number) => {
      try {
          const res = await fetch(`/api/branches/${branchId}/stocks`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId, adjustment })
          });
          if (!res.ok) {
              const error = await res.json();
              throw new Error(error.error || 'Failed to adjust stock');
          }
          refresh();
      } catch (e) {
          console.error(e);
          throw e;
      }
  };

  const addStockToBranch = async (branchId: string, productId: string, quantity: number) => {
      try {
          const res = await fetch(`/api/branches/${branchId}/stocks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId, quantity })
          });
          if (!res.ok) {
              const error = await res.json();
              throw new Error(error.error || 'Failed to add stock');
          }
          refresh();
      } catch (e) {
          console.error(e);
          throw e;
      }
  };

  const transferStock = async (fromBranchId: string, toBranchId: string, productId: string, quantity: number) => {
      try {
          await fetch('/api/inventory', {
              method: 'POST',
              body: JSON.stringify({
                  action: 'TRANSFER',
                  branchId: fromBranchId,
                  targetBranchId: toBranchId,
                  productId,
                  quantity
              })
          });
          refresh();
      } catch (e) {
          console.error(e);
      }
  };
  
  const getStocksByBranch = (branchId: string) => stocks.filter(s => s.branchId === branchId);
  const getProductStock = (productId: string) => stocks.filter(s => s.productId === productId).reduce((sum, s) => sum + s.quantity, 0);

  return (
    <DataContext.Provider value={{
      branches, categories, products, stocks, isLoading, refresh,
      addBranch, updateBranch, deleteBranch, getBranchById,
      addCategory, updateCategory, deleteCategory, getCategoryById,
      addProduct, updateProduct, deleteProduct, getProductById,
      updateStock, adjustStock, addStockToBranch, transferStock,
      getStocksByBranch, getProductStock
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
