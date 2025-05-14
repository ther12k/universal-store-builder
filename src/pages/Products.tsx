
import Layout from "@/components/Layout";
import { useData } from "@/context/DataContext";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Plus, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Products() {
  const { products, categories } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowercasedTerm) ||
        product.sku.toLowerCase().includes(lowercasedTerm) ||
        product.description?.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    return filtered;
  }, [products, searchTerm, selectedCategory]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                viewMode === "grid" && "bg-accent text-accent-foreground"
              )}
              onClick={() => setViewMode("grid")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-grid-2x2"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 12h18" />
                <path d="M12 3v18" />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                viewMode === "list" && "bg-accent text-accent-foreground"
              )}
              onClick={() => setViewMode("list")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-list"
              >
                <line x1="8" x2="21" y1="6" y2="6" />
                <line x1="8" x2="21" y1="12" y2="12" />
                <line x1="8" x2="21" y1="18" y2="18" />
                <line x1="3" x2="3.01" y1="6" y2="6" />
                <line x1="3" x2="3.01" y1="12" y2="12" />
                <line x1="3" x2="3.01" y1="18" y2="18" />
              </svg>
            </Button>
            <Button onClick={() => navigate("/products/new")}>
              <Plus size={16} className="mr-2" /> Add Product
            </Button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const isLowStock = product.quantity <= product.reorderLevel;
  const isOutOfStock = product.quantity <= 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="aspect-square bg-muted flex items-center justify-center relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <Package size={48} className="text-muted-foreground" />
        )}
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
        {!isOutOfStock && isLowStock && (
          <Badge variant="outline" className="absolute top-2 right-2 border-orange-300 bg-orange-100 text-orange-800">
            Low Stock
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base truncate">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground text-sm">
          SKU: {product.sku}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <span className="font-semibold">{formatCurrency(product.price)}</span>
        <span>Stock: {product.quantity}</span>
      </CardFooter>
    </Card>
  );
}

function ProductListItem({ product }: { product: Product }) {
  const navigate = useNavigate();
  const isLowStock = product.quantity <= product.reorderLevel;
  const isOutOfStock = product.quantity <= 0;

  return (
    <div
      className="border rounded-lg p-4 flex items-center gap-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-md flex-shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full rounded-md"
          />
        ) : (
          <Package size={24} className="text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          {product.category} • SKU: {product.sku}
        </p>
      </div>
      <div className="flex-1 hidden md:block">
        <p className="text-sm">{product.supplier}</p>
        <p className="text-sm text-muted-foreground">
          {product.location}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{formatCurrency(product.price)}</p>
        <div className="flex items-center justify-end gap-2">
          <span
            className={cn(
              "text-sm",
              isOutOfStock
                ? "text-destructive font-medium"
                : isLowStock
                ? "text-orange-600 font-medium"
                : "text-muted-foreground"
            )}
          >
            Stock: {product.quantity}
          </span>
          {isOutOfStock ? (
            <Badge variant="destructive" className="ml-2">
              Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge variant="outline" className="border-orange-300 bg-orange-100 text-orange-800">
              Low Stock
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  );
}
