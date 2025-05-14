
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  "#3366CC", "#DC3912", "#FF9900", "#109618", 
  "#990099", "#0099C6", "#DD4477", "#66AA00", 
  "#B82E2E", "#316395", "#994499", "#22AA99"
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-2 rounded-md shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryDistribution() {
  const { dashboard } = useData();
  
  // Only show top 6 categories and group the rest as "Others"
  const prepareData = () => {
    if (!dashboard.categoryCounts.length) return [];
    
    if (dashboard.categoryCounts.length <= 6) {
      return dashboard.categoryCounts;
    }
    
    const topCategories = dashboard.categoryCounts.slice(0, 5);
    const others = dashboard.categoryCounts.slice(5);
    const othersSum = others.reduce((sum, cat) => sum + cat.value, 0);
    
    return [
      ...topCategories,
      { name: "Others", value: othersSum }
    ];
  };
  
  const data = prepareData();

  return (
    <Card className="col-span-1 md:col-span-2 card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No category data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
