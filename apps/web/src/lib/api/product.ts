import { api } from "@/utils/axios";
import type {
  Product,
  ProductListResponse,
  ProductResponse,
} from "@/lib/types";

export const productApi = {
  getAll: async (
    params?: {
      search?: string;
      take?: number;
      skip?: number;
      orderBy?: string;
      orderDirection?: "asc" | "desc";
      isActive?: boolean;
      stockGreaterThan?: number;
      categoryId?: string;
    },
    token?: string
  ) => {
    const response = await api.get<{
      data: ProductListResponse;
      total: number;
    }>("/products", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  create: async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">,
    token?: string
  ) => {
    const response = await api.post<ProductResponse>("/products", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },
  update: async (
    id: string,
    data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
    token?: string
  ) => {
    const response = await api.patch<ProductResponse>(`/products/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },
  restock: async (
    id: string,
    data: { quantityAdded: number; newCostPrice: number },
    token?: string
  ) => {
    const response = await api.post<ProductResponse>(
      `/products/${id}/restock`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },
  deactivate: async (id: string, token?: string) => {
    const response = await api.patch<ProductResponse>(
      `/products/${id}/deactivate`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },
  getCategories: async (token?: string) => {
    const response = await api.get(`/products/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data =
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
        ? (response.data as { data: unknown }).data
        : [];
    return Array.isArray(data) ? data : [];
  },
  createCategory: async (name: string, token?: string) => {
    const response = await api.post(
      `/products/categories`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data =
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
        ? (response.data as { data: unknown }).data
        : null;
    return data;
  },
  activate: async (id: string, token?: string) => {
    const response = await api.patch<ProductResponse>(
      `/products/${id}/activate`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },
  delete: async (id: string, token?: string) => {
    const response = await api.delete<ProductResponse>(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },
};

export const restockProductApi = async (
  id: string,
  data: { quantityAdded: number; newCostPrice: number },
  token?: string
): Promise<Product> => {
  const response = await api.post<ProductResponse>(
    `/products/${id}/restock`,
    data,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined
  );
  return response.data.data;
};
