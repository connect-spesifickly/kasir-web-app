import { Product } from "@/lib/types";
import { CardSkeleton } from "./card-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, EyeOff, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockBadge } from "./stock-badge";
import { formatRupiah } from "@/lib/utils";
export const ProductCards = ({
  products,
  loading,
  onEdit,
  onRestock,
  onDeactivate,
  onActivate,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}: {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onRestock: (product: Product) => void;
  onDeactivate: (product: Product) => void;
  onActivate: (product: Product) => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className={product.isActive ? "" : "bg-gray-100"}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle
                  className={`text-base ${product.isActive ? "" : "line-through text-gray-500"}`}
                >
                  {product.productName}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{product.productCode}</Badge>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${product.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}
                  >
                    {product.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatRupiah(Number(product.price))}
                </span>
                <StockBadge stock={product.stock} minStock={product.minStock} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 flex-col !p-2 gap-0 "
                  onClick={() => onEdit(product)}
                  disabled={!product.isActive}
                >
                  <Edit className="h-3 w-3 " />
                  <div className="text-[11px]">Edit</div>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 flex-col !p-2 gap-0 "
                  onClick={() => onRestock(product)}
                  disabled={!product.isActive}
                >
                  <Package className="h-3 w-3 " />
                  <div className="text-[11px]">Restock</div>
                </Button>
                {product.isActive ? (
                  <Button
                    variant="outline"
                    className="flex-1 flex-col !p-2 gap-0 "
                    onClick={() => onDeactivate(product)}
                  >
                    <EyeOff className="h-3 w-3 " />
                    <div className="text-[11px]"> Nonaktif</div>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="flex-1 flex-col !p-2 gap-0 bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                    onClick={() => onActivate(product)}
                  >
                    <Eye className="h-3 w-3 " />
                    <div className="text-[11px]"> Aktifkan</div>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {products.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};
