
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecentTransactions() {
  const { dashboard } = useData();
  const { recentTransactions } = dashboard;

  return (
    <Card className="col-span-1 md:col-span-2 card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      transaction.type === "in"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    )}
                  >
                    {transaction.type === "in" ? (
                      <ArrowDown size={18} />
                    ) : (
                      <ArrowUp size={18} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.type === "in"
                        ? `Received ${transaction.quantity} units`
                        : `Issued ${transaction.quantity} units`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), "h:mm a")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent transactions</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
