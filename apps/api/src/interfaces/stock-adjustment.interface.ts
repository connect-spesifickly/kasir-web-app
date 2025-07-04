export interface StockAdjustment {
  id: string;
  productId: string;
  userId: string;
  quantityChange: number;
  lastStock: number;
  reason: string;
  createdAt: Date;
}
