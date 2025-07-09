"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { productApi } from "@/lib/utils";
import { toast } from "sonner";

export function useProducts(search?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getAll({ search, take: 100 });
      setProducts(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      toast("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const createProduct = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newProduct = await productApi.create(data);
      setProducts((prev) => [...prev, newProduct]);
      toast("Produk berhasil ditambahkan");
      return newProduct;
    } catch (err) {
      toast("Failed to create product");
      throw err;
    }
  };

  const restockProduct = async (
    id: string,
    quantityAdded: number,
    newCostPrice: number
  ) => {
    try {
      const updatedProduct = await productApi.restock(id, {
        quantityAdded,
        newCostPrice,
      });
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
      await productApi.deactivate(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
      );
      toast("Produk berhasil dinonaktifkan");
    } catch (err) {
      toast("Failed to deactivate product");
      throw err;
    }
  };

  return {
    products: products.filter((p) => p.isActive),
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    restockProduct,
    deactivateProduct,
  };
}
