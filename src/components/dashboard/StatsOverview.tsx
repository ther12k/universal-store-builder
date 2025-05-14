
import { BarChart4, Package, AlertCircle, DollarSign } from "lucide-react";
import DashboardCard from "../DashboardCard";
import { useData } from "@/context/DataContext";
import { formatCurrency } from "@/lib/utils";

export default function StatsOverview() {
  const { dashboard } = useData();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total Products"
        value={dashboard.totalProducts.toString()}
        icon={<Package size={18} />}
        description="All products in inventory"
      />
      <DashboardCard
        title="Low Stock Items"
        value={dashboard.lowStockCount.toString()}
        icon={<AlertCircle size={18} />}
        description="Items below reorder level"
        className={dashboard.lowStockCount > 0 ? "border-orange-200" : ""}
      />
      <DashboardCard
        title="Inventory Value"
        value={formatCurrency(dashboard.totalValue)}
        icon={<DollarSign size={18} />}
        description="Total retail value"
      />
      <DashboardCard
        title="Categories"
        value={dashboard.categoryCounts.length.toString()}
        icon={<BarChart4 size={18} />}
        description="Product categories"
      />
    </div>
  );
}
