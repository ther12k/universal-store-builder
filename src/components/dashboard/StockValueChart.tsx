
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function StockValueChart() {
  const { dashboard } = useData();
  
  // Prepare data for the chart - only top 5 categories by value
  const chartData = dashboard.stockDistribution
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      value: item.value
    }));

  return (
    <Card className="col-span-1 md:col-span-2 card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Stock Value by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="value" fill="#3366CC" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No stock value data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
