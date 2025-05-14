
import Layout from "@/components/Layout";
import { useData } from "@/context/DataContext";
import { Transaction } from "@/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Transactions() {
  const { transactions } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.productName.toLowerCase().includes(lowercasedTerm) ||
        transaction.notes?.toLowerCase().includes(lowercasedTerm) ||
        transaction.user.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    
    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [transactions, searchTerm, typeFilter, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={(value: "all" | "in" | "out") => setTypeFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="in">Stock In</SelectItem>
                <SelectItem value="out">Stock Out</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="hidden md:table-cell">User</TableHead>
                <TableHead className="hidden md:table-cell">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    <p className="text-muted-foreground">No transactions found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <TableRow>
      <TableCell>
        <div>
          {format(new Date(transaction.date), "MMM d, yyyy")}
          <div className="text-xs text-muted-foreground">
            {format(new Date(transaction.date), "h:mm a")}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              transaction.type === "in"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            } mr-2`}
          >
            {transaction.type === "in" ? (
              <ArrowDown size={14} />
            ) : (
              <ArrowUp size={14} />
            )}
          </span>
          <span>
            {transaction.type === "in" ? "Stock In" : "Stock Out"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium">{transaction.productName}</span>
      </TableCell>
      <TableCell className="text-right">{transaction.quantity}</TableCell>
      <TableCell className="hidden md:table-cell">{transaction.user}</TableCell>
      <TableCell className="hidden md:table-cell">
        {transaction.notes || "-"}
      </TableCell>
    </TableRow>
  );
}
