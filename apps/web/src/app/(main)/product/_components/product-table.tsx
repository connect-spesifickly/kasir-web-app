import { Product } from "@/lib/types";
import { TableSkeleton } from "./table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, EyeOff, Package, Trash2 } from "lucide-react";
export const ProductTable = ({
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
    return <TableSkeleton />;
  }

  return (
    <Table className="lg:w-[96%] lg:mx-[2%] w-[99%] mx-[0.5%] ">
      <TableHeader>
        <TableRow>
          <TableHead>Kode</TableHead>
          <TableHead>Nama Produk</TableHead>
          <TableHead>Harga Jual</TableHead>
          <TableHead>Stok</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-mono">{product.productCode}</TableCell>
            <TableCell className="font-medium">{product.productName}</TableCell>
            <TableCell>Rp {product.price.toLocaleString()}</TableCell>
            <TableCell>
              <StockBadge stock={product.stock} />
            </TableCell>
            <TableCell>
              <Badge variant={product.isActive ? "default" : "secondary"}>
                {product.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex flex-col !px-2 gap-0 "
                  onClick={() => onEdit(product)}
                >
                  <Edit className="h-3 w-3 " />
                  <div className="text-[11px]">Perbarui</div>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col !p-2 gap-0 "
                  onClick={() => onRestock(product)}
                >
                  <Package className="h-3 w-3 " />
                  <div className="text-[11px]">Restock</div>
                </Button>
                {product.isActive ? (
                  <Button
                    variant="outline"
                    className="flex flex-col !p-2 gap-0 "
                    onClick={() => onDeactivate(product)}
                  >
                    <EyeOff className="h-3 w-3 " />
                    <div className="text-[11px]"> Nonaktif</div>
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3" />
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
