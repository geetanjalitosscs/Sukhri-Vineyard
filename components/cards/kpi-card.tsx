import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, className }: KPICardProps) {
  if (!Icon) {
    console.error(`Icon component is undefined for KPICard: ${title}`);
    return null;
  }

  return (
    <Card className={cn("hover:shadow-md transition-all duration-200 border-border/50 w-full min-w-0", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-1.5 leading-tight">{title}</p>
            <p className="text-2xl font-semibold text-foreground mb-1.5">{value}</p>
            {trend && (
              <p
                className={cn(
                  "text-[10px] font-medium leading-tight",
                  trend.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last week
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0 ml-3">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

