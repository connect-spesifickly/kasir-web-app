import { api } from "@/utils/axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product } from "@/lib/types";

export const saleApi = {
  create: async (cart: { productId: string; quantity: number }[]) => {
    const response = await api.post<{ data: unknown }>("/sales", { cart });
    return response.data.data;
  },
};

export const productApi = {
  getAll: async (params?: { search?: string; take?: number }) => {
    const response = await api.get<{ data: Product[] }>("/products", {
      params,
    });
    return response.data;
  },
  create: async (data: Omit<Product, "id" | "createdAt">) => {
    const response = await api.post<{ data: Product }>("/products", data);
    return response.data.data;
  },
  restock: async (
    id: string,
    data: { quantityAdded: number; newCostPrice: number }
  ) => {
    const response = await api.post<{ data: Product }>(
      `/products/${id}/restock`,
      data
    );
    return response.data.data;
  },
  deactivate: async (id: string) => {
    const response = await api.patch<{ data: Product }>(
      `/products/${id}/deactivate`
    );
    return response.data.data;
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
