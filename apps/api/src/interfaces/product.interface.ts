import { Decimal } from "@prisma/client/runtime/library";

export interface Product {
  id: string;
  productCode: string;
  productName: string;
  costPrice: Decimal;
  price: Decimal;
  stock: number;
  minStock: number;
  isActive: boolean;
  categoryId: string | null;
  categoryName?: string;
}
