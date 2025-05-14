
import { Product, Category, Supplier, Transaction, Dashboard } from "@/types";

// Mock product data
const categories = [
  "Fruits & Vegetables", 
  "Dairy & Eggs", 
  "Bakery",
  "Meat & Seafood",
  "Frozen Foods",
  "Beverages",
  "Snacks",
  "Canned Goods",
  "Household",
  "Personal Care"
];

const suppliers = [
  { name: "Fresh Farms Inc.", contact: "John Smith", email: "john@freshfarms.com", phone: "555-1234" },
  { name: "Dairy Express", contact: "Emily Johnson", email: "emily@dairyexpress.com", phone: "555-2345" },
  { name: "Baker's Best", contact: "Michael Brown", email: "michael@bakersbest.com", phone: "555-3456" },
  { name: "Sea Foods Co.", contact: "Sarah Wilson", email: "sarah@seafoods.com", phone: "555-4567" },
  { name: "Frozen Delights", contact: "David Lee", email: "david@frozendelights.com", phone: "555-5678" },
];

const locations = ["Aisle 1", "Aisle 2", "Aisle 3", "Aisle 4", "Aisle 5", "Cold Storage", "Freezer", "Warehouse", "Display"];

// Helper functions
const generateId = () => crypto.randomUUID();

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const generateSku = (category: string, id: number) => {
  const prefix = category.substring(0, 2).toUpperCase();
  return `${prefix}${id.toString().padStart(4, '0')}`;
};

// Generate products
const generateProducts = (count = 50): Product[] => {
  const products: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const categoryIndex = randomInt(0, categories.length - 1);
    const category = categories[categoryIndex];
    const supplierIndex = randomInt(0, suppliers.length - 1);
    const supplier = suppliers[supplierIndex].name;
    
    const costPrice = randomInt(1, 50);
    const markup = 1 + randomInt(10, 40) / 100; // 10-40% markup
    const price = Math.round(costPrice * markup * 100) / 100;
    const quantity = randomInt(0, 100);
    const reorderLevel = randomInt(10, 20);
    
    products.push({
      id: generateId(),
      name: `Sample ${category} ${i+1}`,
      category,
      sku: generateSku(category, i),
      price,
      costPrice,
      quantity,
      reorderLevel,
      supplier,
      location: locations[randomInt(0, locations.length - 1)],
      description: `Description for Sample ${category} ${i+1}`,
      lastUpdated: randomDate(new Date(2023, 0, 1), new Date()),
      expiryDate: Math.random() > 0.5 ? randomDate(new Date(), new Date(2024, 11, 31)) : undefined
    });
  }
  
  return products;
};

// Generate categories with counts
const generateCategories = (products: Product[]): Category[] => {
  const categoryCounts = new Map<string, number>();
  
  products.forEach(product => {
    const count = categoryCounts.get(product.category) || 0;
    categoryCounts.set(product.category, count + 1);
  });
  
  return Array.from(categoryCounts).map(([name, count]) => ({
    id: generateId(),
    name,
    count
  }));
};

// Generate supplier list
const generateSuppliers = (): Supplier[] => {
  return suppliers.map(s => ({
    id: generateId(),
    ...s
  }));
};

// Generate transactions
const generateTransactions = (products: Product[], count = 100): Transaction[] => {
  const transactions: Transaction[] = [];
  const users = ["Admin", "Store Manager", "Inventory Clerk", "Sales Associate"];
  
  for (let i = 0; i < count; i++) {
    const productIndex = randomInt(0, products.length - 1);
    const product = products[productIndex];
    const type = Math.random() > 0.5 ? 'in' : 'out';
    const quantity = randomInt(1, 20);
    
    transactions.push({
      id: generateId(),
      type,
      productId: product.id,
      productName: product.name,
      quantity,
      date: randomDate(new Date(2023, 0, 1), new Date()),
      user: users[randomInt(0, users.length - 1)],
      notes: Math.random() > 0.7 ? `${type === 'in' ? 'Restocked' : 'Sold'} ${quantity} units` : undefined
    });
  }
  
  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate dashboard data
const generateDashboard = (products: Product[], categories: Category[], transactions: Transaction[]): Dashboard => {
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity <= p.reorderLevel).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
  // Get category distribution
  const categoryCounts = categories
    .map(category => ({
      name: category.name,
      value: category.count
    }))
    .sort((a, b) => b.value - a.value);
  
  // Stock distribution by value
  const stockDistribution = categories
    .map(category => {
      const categoryProducts = products.filter(p => p.category === category.name);
      const value = categoryProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      return {
        name: category.name,
        value: Math.round(value * 100) / 100
      };
    })
    .sort((a, b) => b.value - a.value);
  
  return {
    totalProducts,
    lowStockCount,
    totalValue: Math.round(totalValue * 100) / 100,
    categoryCounts,
    stockDistribution,
    recentTransactions: transactions.slice(0, 5)
  };
};

// Main function to generate all mock data
export const generateMockData = () => {
  const products = generateProducts();
  const categories = generateCategories(products);
  const suppliers = generateSuppliers();
  const transactions = generateTransactions(products);
  const dashboard = generateDashboard(products, categories, transactions);
  
  return {
    products,
    categories,
    suppliers,
    transactions,
    dashboard
  };
};
