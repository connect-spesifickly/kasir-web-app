export interface Sale {
  id: string;
  transactionTime: Date;
  totalAmount: number;
}

export interface SaleDetail {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  priceAtSale: number;
  costAtSale: number;
}
