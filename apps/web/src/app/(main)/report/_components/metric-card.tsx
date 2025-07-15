"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  loading: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  borderColor,
  loading,
}: MetricCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-4">
        {loading ? (
          <Skeleton className="h-8 w-32 mb-2" />
        ) : (
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
        )}
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-center mt-2">
          <Icon className={`h-4 w-4 mr-1 ${color.replace("text-", "text-")}`} />
          <span className={`text-xs ${color}`}>{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}
