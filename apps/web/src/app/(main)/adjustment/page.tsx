"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Package,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useProducts } from "@/hooks/use-products";

import {
  getAdjustmentIcon,
  getAdjustmentBadge,
  formatDate,
} from "@/lib/utils/stock-adjustment";

import { useStockAdjustments } from "@/hooks/use-stock-adjustment";
import { AdjustmentForm } from "./_components/adjustment-form";
import { AdjustmentFilters } from "./_components/adjustment-filters";
import { STOCK_ADJUSTMENT_MESSAGES } from "@/lib/constant/stock-adjustment";
import type { StockAdjustment } from "@/types/stock-adjustment";
import type { StockAdjustmentCreateData } from "@/types/stock-adjustment";

export default function PenyesuaianStokPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [dateTo, setDateTo] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Pagination & sorting state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4);
  const [sortBy, setSortBy] = useState<
    "createdAt" | "productName" | "quantityChange"
  >("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { adjustments, loading, createAdjustment, total } = useStockAdjustments(
    {
      search: searchTerm,
      startDate: dateFrom,
      endDate: dateTo,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: sortBy,
      orderDirection: sortDirection,
    }
  );
  const totalPages = Math.ceil(total / pageSize);
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  // Sorting handlers
  const handleSort = (col: "createdAt" | "productName" | "quantityChange") => {
    if (sortBy === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDirection(col === "createdAt" ? "desc" : "asc");
    }
    setPage(1);
  };

  const { products, loading: productsLoading } = useProducts();

  const handleCreateAdjustment = async (data: StockAdjustmentCreateData) => {
    await createAdjustment(data);
    setIsAddModalOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDateFrom(new Date().toISOString().slice(0, 10));
    setDateTo(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className="flex flex-col  w-full">
      <div className="w-full h-full relative">
        <div className="sticky top-16  z-40 bg-background border-b ">
          <div className="flex h-16 shrink-0 items-center gap-2 md:px-1 px-2 w-full justify-between">
            <h1 className="text-2xl md:text-3xl font-bold md:px-5 font-[stencil]">
              Penyesuaian Stok
            </h1>
            {/* Desktop: tombol besar, Mobile: icon plus */}
            <div className="flex items-center">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                {/* Desktop Button */}
                <DialogTrigger asChild>
                  <Button className="hidden md:flex md:w-auto mr-[21px]">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Penyesuaian
                  </Button>
                </DialogTrigger>
                {/* Mobile Button */}
                <DialogTrigger asChild>
                  <Button
                    className="md:hidden rounded-lg px-5 py-2 font-bold shadow-md"
                    size="lg"
                    variant="default"
                  >
                    <Plus className="h-7 w-7" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Buat Penyesuaian Stok</DialogTitle>
                  </DialogHeader>
                  <AdjustmentForm
                    products={products}
                    productsLoading={productsLoading}
                    onSubmit={handleCreateAdjustment}
                    onCancel={() => setIsAddModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-2 md:p-6">
          {/* Filters */}
          <AdjustmentFilters
            searchTerm={searchTerm}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onSearchChange={setSearchTerm}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onReset={resetFilters}
          />

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="">
                {/* Anda sudah menggunakan pola loading yang baik di sini */}
                {loading ? (
                  <div className="p-6 space-y-4">
                    {/* Skeleton loading, tidak perlu diubah */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table className="lg:w-[96%] lg:mx-[2%] w-[99%] mx-[0.5%]">
                    <TableHeader>
                      <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
                        <TableHead
                          className="w-[15%] cursor-pointer select-none"
                          onClick={() => handleSort("createdAt")}
                        >
                          <div className="flex items-center">
                            Tanggal
                            {sortBy === "createdAt" ? (
                              sortDirection === "asc" ? (
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
                          className="w-[25%] cursor-pointer select-none"
                          onClick={() => handleSort("productName")}
                        >
                          {/* Tidak ada perubahan di sini */}
                          Produk
                        </TableHead>
                        {/* PERBAIKAN 1: Perataan dan visualisasi kolom "Perubahan" */}
                        <TableHead
                          className="w-[15%] cursor-pointer select-none text-right" // <-- Rata kanan
                          onClick={() => handleSort("quantityChange")}
                        >
                          <div className="flex items-center justify-end">
                            {" "}
                            {/* <-- Rata kanan */}
                            Perubahan
                            {sortBy === "quantityChange" ? (
                              sortDirection === "asc" ? (
                                <ChevronUp className="w-4 h-4 ml-1" />
                              ) : (
                                <ChevronDown className="w-4 h-4 ml-1" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-4 h-4 ml-1 text-muted-foreground" />
                            )}
                          </div>
                        </TableHead>
                        {/* PERBAIKAN 2: Perataan kolom "Stok Sebelum" */}
                        <TableHead className="px-6 w-[15%] text-right">
                          Stok Sebelum
                        </TableHead>{" "}
                        {/* <-- Rata kanan */}
                        <TableHead className="w-[20%] px-8">Alasan</TableHead>
                        <TableHead className="w-[10%]">Oleh</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adjustments.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            {STOCK_ADJUSTMENT_MESSAGES.EMPTY_DATA}
                          </TableCell>
                        </TableRow>
                      ) : (
                        adjustments.map((adjustment: StockAdjustment) => (
                          <TableRow
                            key={adjustment.id}
                            className="hover:bg-gray-50/70"
                          >
                            <TableCell className="tabular-nums text-muted-foreground">
                              {" "}
                              {/* Tambah tabular-nums agar rapi */}
                              {formatDate(adjustment.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {adjustment.product?.productName ??
                                    "Produk tidak ada"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {" "}
                                  {/* PERBAIKAN Minor: Dibuat lebih kecil */}
                                  {adjustment.product?.productCode ?? "N/A"}
                                </p>
                              </div>
                            </TableCell>

                            {/* PERBAIKAN 3: Tampilan sel "Perubahan" yang lebih profesional */}
                            <TableCell className="text-right">
                              <span
                                className={`inline-flex items-center gap-1 font-semibold ${
                                  adjustment.quantityChange > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {getAdjustmentIcon(adjustment.quantityChange)}
                                {adjustment.quantityChange > 0
                                  ? `+${adjustment.quantityChange}`
                                  : adjustment.quantityChange}
                              </span>
                            </TableCell>

                            {/* PERBAIKAN 4: Tampilan sel "Stok Sebelum" */}
                            <TableCell className="px-6 text-right tabular-nums">
                              {" "}
                              {/* <-- Rata kanan & tabular-nums */}
                              {adjustment.lastStock}
                            </TableCell>

                            <TableCell>
                              <span className="px-6 text-sm">
                                {adjustment.reason}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {" "}
                                {/* Dibuat lebih pudar */}
                                {adjustment.user?.email ?? "User tidak ada"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                    <tfoot className="bg-gray-50/60 ">
                      <tr>
                        <td colSpan={6} className="px-2">
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-sm text-muted-foreground">
                              Page {page} of {totalPages || 1}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevPage}
                                disabled={page === 1}
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 ">
            {/* Anda sudah menggunakan pola loading yang baik di sini juga */}
            {loading ? (
              // Skeleton loading, tidak perlu diubah
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : adjustments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {STOCK_ADJUSTMENT_MESSAGES.EMPTY_DATA}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {adjustments.map((adjustment: StockAdjustment) => (
                  <Card key={adjustment.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {adjustment.product?.productName ??
                                "Produk tidak ada"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {adjustment.product?.productCode ?? "N/A"}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {getAdjustmentIcon(adjustment.quantityChange)}
                              {getAdjustmentBadge(adjustment.quantityChange)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Stok sebelum:
                          </span>
                          <Badge variant="outline">
                            {adjustment.lastStock}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Alasan: {adjustment.reason}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatDate(adjustment.createdAt)}</span>
                            <span>
                              Oleh: {adjustment.user?.email ?? "User tidak ada"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Pagination Mobile ala Product */}
                {adjustments.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
