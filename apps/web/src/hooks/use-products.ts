"use client";

import type { Product } from "@/lib/types";
import { productApi } from "@/lib/api/product";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import useSWR from "swr";

interface UseProductsParams {
  search?: string;
  take?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  isActive?: boolean;
  stockGreaterThan?: number;
  categoryId?: string;
}

const fetchProductsApi = async (params: UseProductsParams, token?: string) => {
  const response = await productApi.getAll(
    {
      search: params?.search,
      take: params?.take,
      skip: params?.skip,
      orderBy: params?.orderBy,
      orderDirection: params?.orderDirection,
      isActive: params?.isActive,
      stockGreaterThan: params?.stockGreaterThan,
      categoryId: params?.categoryId,
    },
    token
  );
  return {
    products: Array.isArray(response.data.data) ? response.data.data : [],
    total: response.data.total || 0,
  };
};

export function useProducts(params?: UseProductsParams) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const token = session?.accessToken;
  const swrKey = isAuthenticated ? ["products", params, token] : null;
  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => fetchProductsApi(params || {}, token),
    { revalidateOnFocus: false }
  );

  // Mutasi untuk create/update/restock tetap manual agar cache up-to-date
  const createProduct = async (
    dataInput: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newProduct = await productApi.create(dataInput, token);
      mutate();
      toast("Produk berhasil ditambahkan");
      return newProduct;
    } catch (err) {
      toast("Failed to create product");
      throw err;
    }
  };

  const updateProduct = async (
    id: string,
    dataInput: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ) => {
    try {
      const updatedProduct = await productApi.update(id, dataInput, token);
      mutate();
      toast("Produk berhasil diupdate");
      return updatedProduct;
    } catch (err) {
      toast("Failed to update product");
      throw err;
    }
  };

  const restockProduct = async (
    id: string,
    quantityAdded: number,
    newCostPrice: number
  ) => {
    try {
      const updatedProduct = await productApi.restock(
        id,
        { quantityAdded, newCostPrice },
        token
      );
      mutate();
      toast("Stok berhasil ditambahkan");
      return updatedProduct;
    } catch (err) {
      toast("Failed to restock product");
      throw err;
    }
  };

  const deactivateProduct = async (id: string) => {
    try {
      await productApi.deactivate(id, token);
      mutate();
      toast("Produk berhasil dinonaktifkan");
    } catch (err) {
      toast("Gagal menonaktifkan produk, stok product masih ada");
      throw err;
    }
  };

  const activateProduct = async (id: string) => {
    try {
      await productApi.activate(id, token);
      mutate();
      toast("Produk berhasil diaktifkan");
    } catch (err) {
      toast("Gagal mengaktifkan produk");
      throw err;
    }
  };

  return {
    products: data?.products || [],
    loading: isLoading,
    error,
    total: data?.total || 0,
    refetch: mutate,
    createProduct,
    updateProduct,
    restockProduct,
    deactivateProduct,
    activateProduct,
  };
}

// Hook untuk fetch kategori produk
const fetchCategoriesApi = async (token?: string) => {
  const data = await productApi.getCategories(token);
  return Array.isArray(data) ? data : [];
};

export function useCategories() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const swrKey = status === "authenticated" ? ["categories", token] : null;
  const { data, error, isLoading } = useSWR(
    swrKey,
    () => fetchCategoriesApi(token),
    { revalidateOnFocus: false }
  );
  return { categories: data || [], loading: isLoading, error };
}
