export interface Product {
  id: string;
  productCode: string;
  productName: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
}

export interface ProductResponse {
  data: Product;
}

export interface CreateProductData {
  productCode: string;
  productName: string;
  price: number;
  costPrice: number;
  stock: number;
  isActive: boolean;
}

export interface UpdateProductData {
  productCode?: string;
  productName?: string;
  price?: number;
}

export interface RestockData {
  quantityAdded: number;
  newCostPrice: number;
}
