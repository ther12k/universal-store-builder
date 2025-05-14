
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Category, Supplier, Transaction, Dashboard } from "@/types";
import { generateMockData } from "@/lib/mockData";

interface DataContextType {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  transactions: Transaction[];
  dashboard: Dashboard;
  addProduct: (product: Omit<Product, "id" | "lastUpdated">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  isLoading: boolean;
  searchProducts: (term: string) => Product[];
  filterProducts: (category: string) => Product[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    products: Product[];
    categories: Category[];
    suppliers: Supplier[];
    transactions: Transaction[];
    dashboard: Dashboard;
  }>(() => {
    const savedData = localStorage.getItem("inventoryData");
    return savedData ? JSON.parse(savedData) : generateMockData();
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem("inventoryData", JSON.stringify(data));
  }, [data]);

  const addProduct = (product: Omit<Product, "id" | "lastUpdated">) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
    };

    setData((prev) => {
      const updatedProducts = [...prev.products, newProduct];
      
      // Update category count
      const updatedCategories = [...prev.categories];
      const categoryIndex = updatedCategories.findIndex(
        (c) => c.name === product.category
      );
      
      if (categoryIndex >= 0) {
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          count: updatedCategories[categoryIndex].count + 1,
        };
      } else {
        updatedCategories.push({
          id: crypto.randomUUID(),
          name: product.category,
          count: 1,
        });
      }
      
      // Update dashboard
      const updatedDashboard = {
        ...prev.dashboard,
        totalProducts: prev.dashboard.totalProducts + 1,
        totalValue: prev.dashboard.totalValue + (product.price * product.quantity),
      };
      
      return {
        ...prev,
        products: updatedProducts,
        categories: updatedCategories,
        dashboard: updatedDashboard,
      };
    });
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setData((prev) => {
      const productIndex = prev.products.findIndex((p) => p.id === id);
      if (productIndex === -1) return prev;

      const updatedProducts = [...prev.products];
      const oldProduct = prev.products[productIndex];
      
      updatedProducts[productIndex] = {
        ...oldProduct,
        ...product,
        lastUpdated: new Date().toISOString(),
      };
      
      // Handle category change if needed
      let updatedCategories = [...prev.categories];
      if (product.category && product.category !== oldProduct.category) {
        // Decrease count for old category
        const oldCategoryIndex = updatedCategories.findIndex(
          (c) => c.name === oldProduct.category
        );
        if (oldCategoryIndex >= 0) {
          updatedCategories[oldCategoryIndex] = {
            ...updatedCategories[oldCategoryIndex],
            count: Math.max(0, updatedCategories[oldCategoryIndex].count - 1),
          };
        }
        
        // Increase count for new category
        const newCategoryIndex = updatedCategories.findIndex(
          (c) => c.name === product.category
        );
        if (newCategoryIndex >= 0) {
          updatedCategories[newCategoryIndex] = {
            ...updatedCategories[newCategoryIndex],
            count: updatedCategories[newCategoryIndex].count + 1,
          };
        } else {
          updatedCategories.push({
            id: crypto.randomUUID(),
            name: product.category,
            count: 1,
          });
        }
      }

      // Update dashboard values
      const updatedDashboard = { ...prev.dashboard };
      
      // Update low stock count if quantity changed
      if (product.quantity !== undefined) {
        const oldLowStock = oldProduct.quantity <= oldProduct.reorderLevel;
        const newLowStock = product.quantity <= (product.reorderLevel || oldProduct.reorderLevel);
        
        if (oldLowStock && !newLowStock) {
          updatedDashboard.lowStockCount -= 1;
        } else if (!oldLowStock && newLowStock) {
          updatedDashboard.lowStockCount += 1;
        }
      }
      
      return {
        ...prev,
        products: updatedProducts,
        categories: updatedCategories,
        dashboard: updatedDashboard,
      };
    });
  };

  const deleteProduct = (id: string) => {
    setData((prev) => {
      const productIndex = prev.products.findIndex((p) => p.id === id);
      if (productIndex === -1) return prev;
      
      const productToDelete = prev.products[productIndex];
      const updatedProducts = prev.products.filter((p) => p.id !== id);
      
      // Update category count
      const updatedCategories = [...prev.categories];
      const categoryIndex = updatedCategories.findIndex(
        (c) => c.name === productToDelete.category
      );
      
      if (categoryIndex >= 0) {
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          count: Math.max(0, updatedCategories[categoryIndex].count - 1),
        };
      }
      
      // Update dashboard values
      const updatedDashboard = {
        ...prev.dashboard,
        totalProducts: prev.dashboard.totalProducts - 1,
        totalValue: prev.dashboard.totalValue - (productToDelete.price * productToDelete.quantity),
        lowStockCount: productToDelete.quantity <= productToDelete.reorderLevel 
          ? prev.dashboard.lowStockCount - 1 
          : prev.dashboard.lowStockCount,
      };
      
      return {
        ...prev,
        products: updatedProducts,
        categories: updatedCategories,
        dashboard: updatedDashboard,
      };
    });
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    setData((prev) => {
      const updatedTransactions = [newTransaction, ...prev.transactions];
      
      // Update the product quantity
      const updatedProducts = [...prev.products];
      const productIndex = updatedProducts.findIndex(p => p.id === transaction.productId);
      
      if (productIndex >= 0) {
        const product = updatedProducts[productIndex];
        const quantityDelta = transaction.type === 'in' ? transaction.quantity : -transaction.quantity;
        const newQuantity = Math.max(0, product.quantity + quantityDelta);
        
        // Check if low stock status changed
        const wasLowStock = product.quantity <= product.reorderLevel;
        const isLowStock = newQuantity <= product.reorderLevel;
        
        let lowStockDelta = 0;
        if (!wasLowStock && isLowStock) lowStockDelta = 1;
        if (wasLowStock && !isLowStock) lowStockDelta = -1;
        
        updatedProducts[productIndex] = {
          ...product,
          quantity: newQuantity,
          lastUpdated: new Date().toISOString(),
        };
        
        // Update dashboard
        const updatedDashboard = {
          ...prev.dashboard,
          lowStockCount: prev.dashboard.lowStockCount + lowStockDelta,
          totalValue: prev.dashboard.totalValue + (product.price * quantityDelta),
          recentTransactions: [newTransaction, ...prev.dashboard.recentTransactions.slice(0, 4)],
        };
        
        return {
          ...prev,
          products: updatedProducts,
          transactions: updatedTransactions,
          dashboard: updatedDashboard,
        };
      }
      
      return {
        ...prev,
        transactions: updatedTransactions,
      };
    });
  };

  const searchProducts = (term: string) => {
    if (!term) return data.products;
    
    const lowerTerm = term.toLowerCase();
    return data.products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerTerm) ||
        product.sku.toLowerCase().includes(lowerTerm) ||
        product.category.toLowerCase().includes(lowerTerm) ||
        product.supplier.toLowerCase().includes(lowerTerm)
    );
  };

  const filterProducts = (category: string) => {
    if (!category || category === "all") return data.products;
    return data.products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  };

  const value = {
    ...data,
    addProduct,
    updateProduct,
    deleteProduct,
    addTransaction,
    isLoading,
    searchProducts,
    filterProducts,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
