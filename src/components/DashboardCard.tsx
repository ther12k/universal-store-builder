
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            {trend && (
              <span
                className={cn(
                  "inline-block mr-1",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
