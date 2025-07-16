import { Product } from "@/lib/types";
import { TableSkeleton } from "./table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
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
import {
  Edit,
  EyeOff,
  Package,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
export const ProductTable = ({
  products,
  loading,
  onEdit,
  onRestock,
  onDelete,
  onDeactivate,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onSortStock,
  sortDirectionStock,
}: {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onRestock: (product: Product) => void;
  onDelete: (product: Product) => void;
  onDeactivate: (product: Product) => void;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSortStock: () => void;
  sortDirectionStock: "asc" | "desc";
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
          <TableHead
            className="cursor-pointer select-none"
            onClick={onSortStock}
          >
            <div className="flex items-center gap-1">
              Stok
              {sortDirectionStock === "asc" ? (
                <ChevronUp className="w-4 h-4 inline" />
              ) : (
                <ChevronDown className="w-4 h-4 inline" />
              )}
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-mono w-[17%]">
              {product.productCode}
            </TableCell>
            <TableCell className="font-medium w-[28%]">
              {product.productName}
            </TableCell>
            <TableCell className="w-[15%]">
              {formatRupiah(Number(product.price))}
            </TableCell>
            <TableCell className="w-[10%]">
              <StockBadge stock={product.stock} minStock={product.minStock} />
            </TableCell>
            <TableCell className="w-[10%]">
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
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
