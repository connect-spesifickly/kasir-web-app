import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export const StockBadge = ({ stock }: { stock: number }) => (
  <Badge
    variant={stock <= 10 ? "destructive" : "default"}
    className="flex items-center gap-1 w-fit"
  >
    {stock <= 10 && <AlertTriangle className="h-3 w-3" />}
    {stock}
  </Badge>
);
