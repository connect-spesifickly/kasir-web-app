import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { StockBadge } from "../../product/_components/stock-badge";
import { formatRupiah } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {product.productCode}
          </Badge>
          <StockBadge stock={product.stock} minStock={product.minStock} />
        </div>
        <h3 className="font-medium text-sm">{product.productName}</h3>
        <p className="text-lg font-bold text-primary">
          {formatRupiah(Number(product.price))}
        </p>
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full"
          size="sm"
          disabled={product.stock === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah
        </Button>
      </div>
    </CardContent>
  </Card>
);
