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
  isActive?: boolean;
  stockGreaterThan?: number;
  categoryId?: string;
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
          isActive: params?.isActive,
          stockGreaterThan: params?.stockGreaterThan,
          categoryId: params?.categoryId,
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
    params?.isActive,
    params?.categoryId,
    params?.stockGreaterThan,
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

  const activateProduct = async (id: string) => {
    try {
      await productApi.activate(id, session?.accessToken);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: true } : p))
      );
      toast("Produk berhasil diaktifkan");
    } catch (err) {
      toast("Gagal mengaktifkan produk");
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
    restockProduct,
    deactivateProduct,
    activateProduct,
  };
}

// Hook untuk fetch kategori produk
export function useCategories() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status !== "authenticated") return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getCategories(session?.accessToken);
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setError("Gagal mengambil kategori");
      } finally {
        setLoading(false);
      }
    })();
  }, [session, status]);
  return { categories, loading, error };
}
