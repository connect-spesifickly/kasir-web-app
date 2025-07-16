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
import { StockBadge } from "./stock-badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  EyeOff,
  Eye,
  Package,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

export const ProductTable = ({
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
  onSortStock,
  sortDirectionStock,
  onSortDate,
  onSortName,
  sortDirectionDate,
  sortDirectionName,
  sortBy = "stock", // Tambahkan prop ini
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
  onSortStock: () => void;
  sortDirectionStock: "asc" | "desc";
  onSortDate: () => void;
  onSortName: () => void;
  sortDirectionDate: "asc" | "desc";
  sortDirectionName: "asc" | "desc";
  sortBy?: string; // Tambahkan type ini
}) => {
  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <Table className="lg:w-[96%] lg:mx-[2%] w-[99%] mx-[0.5%] ">
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer select-none"
            onClick={onSortDate}
          >
            <div className="flex items-center">
              Tanggal
              {sortBy === "createdAt" ? (
                sortDirectionDate === "asc" ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )
              ) : (
                <ChevronsUpDown className="w-4 h-4 ml-1 text-muted-foreground" />
              )}
            </div>
          </TableHead>
          <TableHead>Kode</TableHead>
          <TableHead
            className="cursor-pointer select-none"
            onClick={onSortName}
          >
            <div className="flex items-center">
              Nama Produk
              {sortBy === "productName" ? (
                sortDirectionName === "asc" ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )
              ) : (
                <ChevronsUpDown className="w-4 h-4 ml-1 text-muted-foreground" />
              )}
            </div>
          </TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Harga Jual</TableHead>
          <TableHead
            className="cursor-pointer select-none"
            onClick={onSortStock}
          >
            <div className="flex items-center">
              Stok
              {sortBy === "stock" ? (
                sortDirectionStock === "asc" ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )
              ) : (
                <ChevronsUpDown className="w-4 h-4 ml-1 text-muted-foreground" />
              )}
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {products.map((product) => (
          <TableRow
            key={product.id}
            className={product.isActive ? "" : "bg-gray-100"}
          >
            <TableCell className="w-[15%]">
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "-"}
            </TableCell>
            <TableCell className="font-mono w-[17%]">
              {product.productCode}
            </TableCell>
            <TableCell
              className={`font-medium w-[28%] ${product.isActive ? "" : "line-through text-gray-500"}`}
            >
              {product.productName}
            </TableCell>
            <TableCell className="w-[15%]">
              {product.categoryName || product.category?.name || "-"}
            </TableCell>
            <TableCell className="w-[15%]">
              {formatRupiah(Number(product.price))}
            </TableCell>
            <TableCell className="w-[10%]">
              <StockBadge stock={product.stock} minStock={product.minStock} />
            </TableCell>
            <TableCell className="w-[10%]">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${product.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}
              >
                {product.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex flex-col !px-2 gap-0 "
                  onClick={() => onEdit(product)}
                  disabled={!product.isActive}
                >
                  <Edit className="h-3 w-3 " />
                  <div className="text-[11px]">Perbarui</div>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col !p-2 gap-0 "
                  onClick={() => onRestock(product)}
                  disabled={!product.isActive}
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
                  <Button
                    variant="default"
                    className="flex flex-col !p-2 gap-0 bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                    onClick={() => onActivate(product)}
                  >
                    <Eye className="h-3 w-3 " />
                    <div className="text-[11px]"> Aktifkan</div>
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={8}>
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
