"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Branch {
  id: string;
  name: string;
  code: string;
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
  
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  updateStock: (branchId: string, productId: string, quantity: number) => Promise<void>;
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
      console.warn("Update Category API not implemented yet");
  };
  
  const deleteCategory = async (id: string) => {
      console.warn("Delete Category API not implemented yet");
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
     console.warn("Update Product API not implemented yet");
  }
  
  const deleteProduct = async (id: string) => {
      console.warn("Delete Product API not implemented yet");
  }

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
      addCategory, updateCategory, deleteCategory,
      addProduct, updateProduct, deleteProduct,
      updateStock, transferStock,
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
