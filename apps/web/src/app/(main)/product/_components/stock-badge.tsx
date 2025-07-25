import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export const StockBadge = ({
  stock,
  minStock,
}: {
  stock: number;
  minStock?: number;
}) => (
  <Badge
    variant={
      typeof minStock === "number" && stock <= minStock
        ? "destructive"
        : "default"
    }
    className="inline-flex items-center gap-1 w-fit min-w-[2.5rem] justify-center"
  >
    {typeof minStock === "number" && stock <= minStock && (
      <AlertTriangle className="h-3 w-3" />
    )}
    {stock}
  </Badge>
);
