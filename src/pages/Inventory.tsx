
import { useState } from "react";
import Layout from "@/components/Layout";
import ProductTable from "@/components/inventory/ProductTable";
import { useData } from "@/context/DataContext";
import { Product } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Inventory() {
  const { products, addTransaction, searchProducts } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionDialog, setTransactionDialog] = useState<{
    open: boolean;
    product: Product | null;
    type: "in" | "out";
  }>({
    open: false,
    product: null,
    type: "in",
  });
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredProducts = searchTerm ? searchProducts(searchTerm) : products;

  const handleAddTransaction = (product: Product, type: "in" | "out") => {
    setTransactionDialog({
      open: true,
      product,
      type,
    });
    setQuantity(1);
    setNotes("");
  };

  const handleTransactionSubmit = () => {
    if (!transactionDialog.product) return;

    // Validate quantity
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero");
      return;
    }

    // Check if quantity to issue doesn't exceed current stock
    if (
      transactionDialog.type === "out" &&
      quantity > transactionDialog.product.quantity
    ) {
      toast.error("Cannot issue more than available stock");
      return;
    }

    addTransaction({
      productId: transactionDialog.product.id,
      productName: transactionDialog.product.name,
      type: transactionDialog.type,
      quantity: quantity,
      user: "Admin", // This should come from the user session
      notes: notes.trim() || undefined,
    });

    setTransactionDialog({ open: false, product: null, type: "in" });
    
    toast.success(
      `${transactionDialog.type === "in" ? "Received" : "Issued"} ${quantity} units of ${
        transactionDialog.product.name
      }`
    );
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="space-y-4">
        <ProductTable products={filteredProducts} onAddTransaction={handleAddTransaction} />
      </div>

      <Dialog 
        open={transactionDialog.open} 
        onOpenChange={(open) => setTransactionDialog({ ...transactionDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionDialog.type === "in" ? "Add Stock" : "Issue Stock"}
            </DialogTitle>
            <DialogDescription>
              {transactionDialog.product?.name} - Current stock:{" "}
              {transactionDialog.product?.quantity}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={
                  transactionDialog.type === "out"
                    ? transactionDialog.product?.quantity
                    : undefined
                }
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this transaction"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTransactionDialog({ ...transactionDialog, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleTransactionSubmit}>
              {transactionDialog.type === "in" ? "Add Stock" : "Issue Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
