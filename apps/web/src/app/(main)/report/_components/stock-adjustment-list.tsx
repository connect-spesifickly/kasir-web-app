"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockAdjustment } from "@/types/stock-adjustment";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { StockAdjustmentItem } from "./stock-adjustment-item";

interface StockAdjustmentListProps {
  stockAdjustments: StockAdjustment[];
  totalLossValue: number;
  loading: boolean;
}

export function StockAdjustmentList({
  stockAdjustments,
  totalLossValue,
  loading,
}: StockAdjustmentListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Detail Penyesuaian Stok
              </span>
              <ChevronDown className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card>
          <CardContent className="p-0">
            <div className="space-y-3 p-6">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))
              ) : stockAdjustments.length > 0 ? (
                stockAdjustments.map((adjustment) => (
                  <StockAdjustmentItem
                    key={adjustment.id}
                    adjustment={{
                      id: adjustment.id,
                      quantityChange: adjustment.quantityChange,
                      reason: adjustment.reason,
                      createdAt: adjustment.createdAt,
                      product: {
                        productName: adjustment.product.productName,
                        costPrice: 0, // costPrice tidak tersedia di API
                      },
                      user: {
                        email: adjustment.user.email,
                      },
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Tidak ada penyesuaian stok dalam periode ini
                  </p>
                </div>
              )}

              {stockAdjustments.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Total Kerugian dari Penyesuaian:
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(totalLossValue)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Berdasarkan{" "}
                    {
                      stockAdjustments.filter(
                        (adj) =>
                          adj.quantityChange < 0 &&
                          adj.reason !== "Recount Stok" &&
                          adj.reason !== "Retur Supplier"
                      ).length
                    }{" "}
                    penyesuaian negatif (tidak termasuk Recount Stok dan Retur
                    Supplier)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
