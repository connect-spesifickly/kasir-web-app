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
  const isLossCalculation =
    adjustment.quantityChange < 0 &&
    adjustment.reason !== "Recount Stok" &&
    adjustment.reason !== "Retur Supplier";

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
        isLossCalculation ? "border-red-200 bg-red-50/30" : ""
      }`}
    >
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
          className={`font-bold ${
            adjustment.quantityChange < 0
              ? isLossCalculation
                ? "text-red-600"
                : "text-orange-600"
              : "text-green-600"
          }`}
        >
          {adjustment.quantityChange > 0 ? "+" : ""}
          {adjustment.quantityChange} unit
        </p>
        <p className="text-sm text-muted-foreground">
          {isLossCalculation && (
            <span className="text-red-600 font-medium">
              Dihitung sebagai kerugian
            </span>
          )}
          {!isLossCalculation && adjustment.quantityChange < 0 && (
            <span className="text-orange-600 font-medium">
              Tidak dihitung sebagai kerugian
            </span>
          )}
          {adjustment.quantityChange > 0 && (
            <span className="text-green-600 font-medium">Penambahan stok</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          Oleh: {adjustment.user.email}
        </p>
      </div>
    </div>
  );
}
