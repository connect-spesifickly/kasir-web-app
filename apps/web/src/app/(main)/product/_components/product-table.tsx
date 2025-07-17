// File: components/ProductTable.tsx

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
  MoreVertical,
  Package as PackageIcon,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
  sortDirectionName,
  sortBy = "stock",
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
  sortDirectionName: "asc" | "desc";
  sortBy?: string;
}) => {
  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/60 hover:bg-gray-50">
          <TableHead
            className="w-[28%] cursor-pointer select-none text-left"
            onClick={onSortName}
          >
            <div className="flex items-center">
              Produk
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
          <TableHead
            className="w-[10%] cursor-pointer select-none text-right"
            onClick={onSortStock}
          >
            <div className="flex items-center justify-end w-full">
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
          <TableHead className="w-[15%] text-right px-6">Harga Jual</TableHead>
          <TableHead className="w-[15%] text-left px-6">Kategori</TableHead>
          <TableHead className="w-[10%] text-center">Status</TableHead>
          <TableHead
            className="w-[15%] cursor-pointer select-none text-right"
            onClick={onSortDate}
          >
            <div className="flex items-center justify-end">
              Tgl Dibuat
              {sortBy === "createdAt" ? (
                sortDirectionStock === "asc" ? ( // Anda bisa ganti ini dengan state sort date sendiri
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )
              ) : (
                <ChevronsUpDown className="w-4 h-4 ml-1 text-muted-foreground" />
              )}
            </div>
          </TableHead>
          <TableHead className="text-center w-[5%]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center py-8 text-muted-foreground"
            >
              <div className="flex flex-col items-center space-y-2">
                <PackageIcon className="h-12 w-12 text-muted-foreground " />
                <p className="text-muted-foreground">Tidak ada data product</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow
              key={product.id}
              className={`border-b hover:bg-gray-50/70 ${product.isActive ? "" : "bg-gray-50/50"}`}
            >
              {/* PRODUK */}
              <TableCell className="align-top">
                <div
                  className={`font-medium text-gray-800 ${product.isActive ? "" : "text-gray-400 line-through"}`}
                >
                  {product.productName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {product.productCode}
                </div>
              </TableCell>

              {/* STOK */}
              <TableCell className="align-middle">
                <div className="flex justify-end">
                  <StockBadge
                    stock={product.stock}
                    minStock={product.minStock}
                  />
                </div>
              </TableCell>

              {/* HARGA JUAL */}
              <TableCell className="px-6 text-right align-middle tabular-nums text-gray-800">
                {formatRupiah(Number(product.price))}
              </TableCell>

              {/* KATEGORI */}
              <TableCell className="px-6 align-middle">
                {product.categoryName || product.category?.name || (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>

              {/* STATUS */}
              <TableCell className="text-center align-middle">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}
                >
                  {product.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </TableCell>

              {/* TANGGAL */}
              <TableCell className="text-right align-middle tabular-nums text-sm text-muted-foreground">
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </TableCell>

              {/* AKSI */}
              <TableCell className="text-center align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(product)}
                      disabled={!product.isActive}
                    >
                      <Edit className="h-4 w-4 mr-2" /> Perbarui
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onRestock(product)}
                      disabled={!product.isActive}
                    >
                      <Package className="h-4 w-4 mr-2" /> Restock
                    </DropdownMenuItem>
                    {product.isActive ? (
                      <DropdownMenuItem onClick={() => onDeactivate(product)}>
                        <EyeOff className="h-4 w-4 mr-2" /> Nonaktifkan
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => onActivate(product)}>
                        <Eye className="h-4 w-4 mr-2" /> Aktifkan
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow className="bg-gray-50/60 ">
          <TableCell colSpan={7}>
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
