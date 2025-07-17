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
  categoryId?: string;
  categoryName?: string;
  category?: { name: string };
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
  minStock: number;
  isActive: boolean;
  categoryId?: string;
  categoryName?: string;
}

export interface UpdateProductData {
  productCode?: string;
  productName?: string;
  price?: number;
  minStock?: number;
  categoryId?: string;
  categoryName?: string;
}

export interface RestockData {
  quantityAdded: number;
  newCostPrice: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
}
