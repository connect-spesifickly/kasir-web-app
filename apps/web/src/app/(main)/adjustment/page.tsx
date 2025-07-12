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
import { Plus, Package } from "lucide-react";
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

  const { adjustments, loading, createAdjustment } = useStockAdjustments({
    search: searchTerm,
    startDate: dateFrom,
    endDate: dateTo,
  });

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
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-2">
        <h1 className="text-2xl md:text-3xl font-bold md:px-5 font-[stencil]">
          Penyesuaian Stok
        </h1>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-2 md:p-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Buat Penyesuaian
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
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
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
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Perubahan</TableHead>
                      <TableHead>Stok Sebelum</TableHead>
                      <TableHead>Alasan</TableHead>
                      <TableHead>Oleh</TableHead>
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
                        <TableRow key={adjustment.id}>
                          <TableCell>
                            {formatDate(adjustment.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {adjustment.product.productName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {adjustment.product.productCode}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getAdjustmentIcon(adjustment.quantityChange)}
                              {getAdjustmentBadge(adjustment.quantityChange)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {adjustment.lastStock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{adjustment.reason}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {adjustment.user.email}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {loading ? (
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
            adjustments.map((adjustment: StockAdjustment) => (
              <Card key={adjustment.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {adjustment.product.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {adjustment.product.productCode}
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
                      <Badge variant="outline">{adjustment.lastStock}</Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Alasan: {adjustment.reason}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(adjustment.createdAt)}</span>
                        <span>Oleh: {adjustment.user.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Floating Action Button - Mobile */}
        <Button
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg md:hidden"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
