export interface Product {
  id: string;
  productCode: string;
  productName: string;
  price: number;
  costPrice?: number;
  stock: number;
  isActive?: boolean;
  createdAt?: string;
}
