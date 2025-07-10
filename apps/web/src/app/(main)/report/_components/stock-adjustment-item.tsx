"use client";

interface StockAdjustmentItemProps {
  adjustment: {
    id: string;
    quantityChange: number;
    reason: string;
    createdAt: string;
    product: {
      productName: string;
      costPrice: number;
    };
    user: {
      email: string;
    };
  };
}

export function StockAdjustmentItem({ adjustment }: StockAdjustmentItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <p className="font-medium">{adjustment.product.productName}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(adjustment.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Alasan: {adjustment.reason}
        </p>
      </div>
      <div className="text-right">
        <p
          className={`font-bold ${adjustment.quantityChange < 0 ? "text-red-600" : "text-green-600"}`}
        >
          {adjustment.quantityChange > 0 ? "+" : ""}
          {adjustment.quantityChange} unit
        </p>
        <p className="text-sm text-muted-foreground">
          Nilai:{" "}
          {formatCurrency(
            Math.abs(adjustment.quantityChange) * adjustment.product.costPrice
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          Oleh: {adjustment.user.email}
        </p>
      </div>
    </div>
  );
}
