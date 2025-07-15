import { Product } from "@/lib/types";
import { CardSkeleton } from "./card-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, EyeOff, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StockBadge } from "./stock-badge";
import { formatRupiah } from "@/lib/utils";
export const ProductCards = ({
  products,
  loading,
  onEdit,
  onRestock,
  onDelete,
  onDeactivate,
}: {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onRestock: (product: Product) => void;
  onDelete: (product: Product) => void;
  onDeactivate: (product: Product) => void;
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
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{product.productName}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{product.productCode}</Badge>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
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
              >
                <Edit className="h-3 w-3 " />
                <div className="text-[11px]">Edit</div>
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex-col !p-2 gap-0 "
                onClick={() => onRestock(product)}
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="flex-1">
                      <Trash2 className="h-3 w-3 mr-2" />
                      Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus produk `
                        {product.productName}`? Tindakan ini tidak dapat
                        dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(product)}>
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
