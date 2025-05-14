
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { MoreHorizontal, Plus, ArrowDown, ArrowUp, Edit, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useData } from "@/context/DataContext";

interface ProductTableProps {
  products: Product[];
  onAddTransaction?: (product: Product, type: "in" | "out") => void;
}

export default function ProductTable({ products, onAddTransaction }: ProductTableProps) {
  const navigate = useNavigate();
  const { deleteProduct } = useData();
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterValue, setFilterValue] = useState("");

  const sortedProducts = React.useMemo(() => {
    if (!products) return [];

    // Filter products
    const filtered = filterValue
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(filterValue.toLowerCase()) ||
            product.category.toLowerCase().includes(filterValue.toLowerCase()) ||
            product.sku.toLowerCase().includes(filterValue.toLowerCase()) ||
            product.supplier.toLowerCase().includes(filterValue.toLowerCase())
        )
      : products;

    // Sort products
    return [...filtered].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        // Handle number comparison
        const numA = fieldA as number;
        const numB = fieldB as number;
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }
    });
  }, [products, sortField, sortDirection, filterValue]);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: keyof Product }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="ml-1 inline" />
    ) : (
      <ArrowDown size={14} className="ml-1 inline" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter products..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-full sm:max-w-xs"
        />
        <Button onClick={() => navigate("/products/new")}>
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Product <SortIcon field="name" />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category <SortIcon field="category" />
              </TableHead>
              <TableHead className="hidden md:table-cell">SKU</TableHead>
              <TableHead
                className="cursor-pointer text-right hidden md:table-cell"
                onClick={() => handleSort("price")}
              >
                Price <SortIcon field="price" />
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("quantity")}
              >
                Stock <SortIcon field="quantity" />
              </TableHead>
              <TableHead
                className="text-right hidden lg:table-cell"
                onClick={() => handleSort("lastUpdated")}
              >
                Updated <SortIcon field="lastUpdated" />
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className={product.quantity <= product.reorderLevel ? "bg-red-50" : ""}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.sku}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span 
                      className={
                        product.quantity <= 0 
                          ? "text-red-600 font-medium"
                          : product.quantity <= product.reorderLevel 
                            ? "text-orange-600 font-medium" 
                            : ""
                      }
                    >
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right hidden lg:table-cell">
                    {format(new Date(product.lastUpdated), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <Edit size={16} className="mr-2" />
                          View/Edit
                        </DropdownMenuItem>
                        {onAddTransaction && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onAddTransaction(product, "in")}
                            >
                              <ArrowDown size={16} className="mr-2" />
                              Add Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onAddTransaction(product, "out")}
                            >
                              <ArrowUp size={16} className="mr-2" />
                              Issue Stock
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                          onClick={() => {
                            if (window.confirm(`Delete product: ${product.name}?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                        >
                          <Trash size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
