
import Layout from "@/components/Layout";
import StatsOverview from "@/components/dashboard/StatsOverview";
import CategoryDistribution from "@/components/dashboard/CategoryDistribution";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import StockValueChart from "@/components/dashboard/StockValueChart";
import { useData } from "@/context/DataContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { isLoading } = useData();

  if (isLoading) {
    return (
      <Layout showSearch={false}>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
            <Skeleton className="h-[350px] col-span-1 md:col-span-2" />
            <Skeleton className="h-[350px] col-span-1 md:col-span-2" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSearch={false}>
      <div className="space-y-6">
        <StatsOverview />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <CategoryDistribution />
          <StockValueChart />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <RecentTransactions />
        </div>
      </div>
    </Layout>
  );
}
