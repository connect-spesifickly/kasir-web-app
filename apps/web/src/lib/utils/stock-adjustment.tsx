import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function getAdjustmentIcon(change: number) {
  if (change > 0) {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  }
  return <TrendingDown className="h-4 w-4 text-red-600" />;
}

export function getAdjustmentBadge(change: number) {
  if (change > 0) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        +{change}
      </Badge>
    );
  }
  return <Badge variant="destructive">-{Math.abs(change)}</Badge>;
}

export function formatDate(
  dateString: string,
  locale: string = "id-ID"
): string {
  return new Date(dateString).toLocaleDateString(locale);
}

export function formatDateTime(
  dateString: string,
  locale: string = "id-ID"
): string {
  return new Date(dateString).toLocaleString(locale);
}

export function validateQuantityChange(value: string): boolean {
  const num = parseInt(value);
  return !isNaN(num) && num !== 0;
}

export function formatQuantityChange(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}
