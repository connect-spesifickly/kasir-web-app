"use client";

import type { Product } from "@/lib/types";
import { productApi } from "@/lib/api/product";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import useSWRInfinite from "swr/infinite";
import useSWR, { mutate as globalMutate } from "swr";
import * as React from "react";

interface UseProductsParams {
  search?: string;
  take?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  isActive?: boolean;
  stockGreaterThan?: number;
  categoryId?: string;
  skip?: number; // Untuk pagination tradisional
}

interface Category {
  id: string;
  name: string;
}

interface ProductApiResponse {
  products: Product[];
  total: number;
}

const PAGE_SIZE = 12; // Jumlah produk per halaman

const fetchProductsApi = async (
  params: UseProductsParams & { skip: number },
  token?: string
): Promise<ProductApiResponse> => {
  const response = await productApi.getAll(
    {
      search: params?.search,
      take: params?.take || PAGE_SIZE,
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

// Hook untuk infinite scroll
export function useProductsInfinite(params?: UseProductsParams) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const token = session?.accessToken;

  const getKey = (
    pageIndex: number,
    previousPageData: ProductApiResponse | null
  ) => {
    // Jika tidak ada data sebelumnya dan bukan halaman pertama, berarti sudah habis
    if (previousPageData && !previousPageData.products.length) return null;

    // Jika tidak authenticated, return null
    if (!isAuthenticated) return null;

    // Key untuk SWR infinite
    const keyParams = {
      ...params,
      skip: pageIndex * PAGE_SIZE,
      take: PAGE_SIZE,
    };

    return ["products-infinite", keyParams, token];
  };

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite(
      getKey,
      ([, keyParams, token]) =>
        fetchProductsApi(
          keyParams as UseProductsParams & { skip: number },
          token as string
        ),
      {
        revalidateOnFocus: false,
        revalidateFirstPage: false,
      }
    );

  // Flatten semua products dari berbagai halaman
  const products = React.useMemo(() => {
    return data ? data.flatMap((page) => page.products) : [];
  }, [data]);

  // Hitung total dan apakah masih ada data lagi
  const total = data?.[0]?.total || 0;
  const hasMore = products.length < total;
  const isLoadingMore = isValidating && size > 0; // Function untuk load more
  const loadMore = React.useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setSize(size + 1);
    }
  }, [hasMore, isLoadingMore, setSize, size]);

  // Reset ke halaman pertama ketika parameter berubah
  React.useEffect(() => {
    setSize(1);
  }, [params?.search, params?.categoryId, setSize]);

  // Mutasi untuk create/update/restock
  const createProduct = async (
    dataInput: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newProduct = await productApi.create(dataInput, token);
      // Invalidate semua cache products
      mutate();
      // Juga invalidate cache untuk pagination tradisional
      globalMutate((key) => Array.isArray(key) && key[0] === "products");
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
      globalMutate((key) => Array.isArray(key) && key[0] === "products");
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
      globalMutate((key) => Array.isArray(key) && key[0] === "products");
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
      globalMutate((key) => Array.isArray(key) && key[0] === "products");
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
      globalMutate((key) => Array.isArray(key) && key[0] === "products");
      toast("Produk berhasil diaktifkan");
    } catch (err) {
      toast("Gagal mengaktifkan produk");
      throw err;
    }
  };

  return {
    products,
    loading: isLoading,
    loadingMore: isLoadingMore,
    error,
    total,
    hasMore,
    loadMore,
    refetch: mutate,
    createProduct,
    updateProduct,
    restockProduct,
    deactivateProduct,
    activateProduct,
  };
}

// Hook untuk pagination tradisional
export function useProducts(params?: UseProductsParams) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const token = session?.accessToken;

  const swrKey = isAuthenticated ? ["products", params, token] : null;
  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () =>
      fetchProductsApi(params as UseProductsParams & { skip: number }, token),
    { revalidateOnFocus: false }
  );

  const products = data?.products || [];
  const total = data?.total || 0;

  // Mutasi untuk create/update/restock
  const createProduct = async (
    dataInput: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newProduct = await productApi.create(dataInput, token);
      mutate();
      // Juga invalidate cache untuk infinite scroll
      globalMutate(
        (key) => Array.isArray(key) && key[0] === "products-infinite"
      );
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
      globalMutate(
        (key) => Array.isArray(key) && key[0] === "products-infinite"
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
        { quantityAdded, newCostPrice },
        token
      );
      mutate();
      globalMutate(
        (key) => Array.isArray(key) && key[0] === "products-infinite"
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
      await productApi.deactivate(id, token);
      mutate();
      globalMutate(
        (key) => Array.isArray(key) && key[0] === "products-infinite"
      );
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
      globalMutate(
        (key) => Array.isArray(key) && key[0] === "products-infinite"
      );
      toast("Produk berhasil diaktifkan");
    } catch (err) {
      toast("Gagal mengaktifkan produk");
      throw err;
    }
  };

  return {
    products,
    loading: isLoading,
    error,
    total,
    createProduct,
    updateProduct,
    restockProduct,
    deactivateProduct,
    activateProduct,
    refetch: mutate,
  };
}

// Hook untuk fetch kategori produk
const fetchCategoriesApi = async (token?: string): Promise<Category[]> => {
  const data = await productApi.getCategories(token);
  return Array.isArray(data) ? data : [];
};

export function useCategories() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const swrKey = status === "authenticated" ? "categories" : null;
  const { data, error, isLoading } = useSWR(
    swrKey,
    () => fetchCategoriesApi(token),
    { revalidateOnFocus: false }
  );
  return { categories: data || [], loading: isLoading, error };
}
