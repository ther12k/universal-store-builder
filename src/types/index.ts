
export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  costPrice: number;
  quantity: number;
  reorderLevel: number;
  supplier: string;
  location: string;
  image?: string;
  description?: string;
  lastUpdated: string;
  expiryDate?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
}

export interface Transaction {
  id: string;
  type: 'in' | 'out';
  productId: string;
  productName: string;
  quantity: number;
  date: string;
  user: string;
  notes?: string;
}

export interface Dashboard {
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
  categoryCounts: {
    name: string;
    value: number;
  }[];
  recentTransactions: Transaction[];
  stockDistribution: {
    name: string;
    value: number;
  }[];
}
