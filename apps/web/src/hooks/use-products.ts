"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/types";
import { productApi } from "@/lib/api/product";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface UseProductsParams {
  search?: string;
  take?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export function useProducts(params?: UseProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getAll(
        {
          search: params?.search,
          take: params?.take,
          skip: params?.skip,
          orderBy: params?.orderBy,
          orderDirection: params?.orderDirection,
        },
        session?.accessToken
      );
      const data = response.data.data;
      setProducts(Array.isArray(data) ? data : []);
      setTotal(response.data.total || 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      toast("Produk gagal diambil");
    } finally {
      setLoading(false);
    }
  }, [
    params?.search,
    params?.take,
    params?.skip,
    params?.orderBy,
    params?.orderDirection,
    session?.accessToken,
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [fetchProducts, isAuthenticated]);

  const createProduct = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newProduct = await productApi.create(data, session?.accessToken);
      setProducts((prev) => [...prev, newProduct]);
      toast("Produk berhasil ditambahkan");
      return newProduct;
    } catch (err) {
      toast("Failed to create product");
      throw err;
    }
  };

  const updateProduct = async (
    id: string,
    data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ) => {
    try {
      const updatedProduct = await productApi.update(
        id,
        data,
        session?.accessToken
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      toast("Produk berhasil diupdate");
      return updatedProduct;
    } catch (err) {
      toast("Failed to update product");
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productApi.delete(id, session?.accessToken);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast("Produk berhasil dihapus");
    } catch (err) {
      toast("Product yang telah ada riwayat transaksi tidak bisa dihapus");
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
        {
          quantityAdded,
          newCostPrice,
        },
        session?.accessToken
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      toast("Stok berhasil ditambahkan");
      return updatedProduct;
    } catch (err) {
      toast("Failed to restock product");
      throw err;
    }
  };

  const deactivateProduct = async (id: string) => {
    try {
      console.log(id, "ini access tokennya", session?.accessToken);
      await productApi.deactivate(id, session?.accessToken);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
      );
      toast("Produk berhasil dinonaktifkan");
    } catch (err) {
      toast("Gagal menonaktifkan produk, stok product masih ada");
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    total,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    deactivateProduct,
  };
}
