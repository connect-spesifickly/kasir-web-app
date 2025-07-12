// lib/types/stock-adjustment.ts
export interface StockAdjustment {
  id: string;
  productId: string;
  userId: string;
  quantityChange: number;
  lastStock: number;
  reason: string;
  createdAt: string;
  product: {
    id: string;
    productName: string;
    productCode: string;
    stock: number;
    costPrice: number;
  };
  user: {
    id: string;
    email: string;
  };
}

export interface CreateStockAdjustmentRequest {
  productId: string;
  userId: string;
  quantityChange: number;
  reason: string;
}

export interface StockAdjustmentFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  take?: number;
  skip?: number;
}

export interface StockAdjustmentResponse {
  adjustments: StockAdjustment[];
  total: number;
}

// Adjustment reason constants
export const ADJUSTMENT_REASONS = [
  { value: "damaged", label: "Rusak" },
  { value: "expired", label: "Kadaluarsa" },
  { value: "lost", label: "Hilang" },
  { value: "theft", label: "Pencurian" },
  { value: "recount", label: "Recount Stok" },
  { value: "return", label: "Retur Supplier" },
  { value: "other", label: "Lainnya" },
] as const;

export type AdjustmentReasonValue =
  (typeof ADJUSTMENT_REASONS)[number]["value"];

export interface StockAdjustmentCreateData {
  productId: string;
  userId: string;
  quantityChange: number;
  reason: string;
}
