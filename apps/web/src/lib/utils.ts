import { api } from "@/utils/axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  Product,
  ProductListResponse,
  ProductResponse,
} from "@/lib/types";

export const saleApi = {
  create: async (
    cart: { productId: string; quantity: number }[],
    token?: string
  ) => {
    const response = await api.post<{ data: unknown }>(
      "/sales",
      { cart },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },
};

export const productApi = {
  getAll: async (
    params?: { search?: string; take?: number },
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
  delete: async (id: string, token?: string) => {
    const response = await api.delete<ProductResponse>(`/products/${id}`, {
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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Report API

export const reportApi = {
  getSalesReport: async (
    startDate: string,
    endDate: string,
    token?: string
  ) => {
    const response = await api.get(`/report/sales`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getProfitReport: async (
    startDate: string,
    endDate: string,
    token?: string
  ) => {
    const response = await api.get(`/report/profit`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getLossesReport: async (
    startDate: string,
    endDate: string,
    token?: string
  ) => {
    const response = await api.get(`/report/losses`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export const stockAdjustmentApi = {
  getAll: async (
    params: { startDate: string; endDate: string; take?: number },
    token?: string
  ) => {
    const response = await api.get(`/stock-adjustments`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
