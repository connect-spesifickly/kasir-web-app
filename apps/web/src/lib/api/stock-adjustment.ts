import type { StockAdjustment } from "@/types/stock-adjustment";
import { api } from "@/utils/axios";

export const stockAdjustmentApi = {
  getAll: async (
    params: {
      search?: string;
      startDate?: string;
      endDate?: string;
      take?: number;
      skip?: number;
      orderBy?: string;
      orderDirection?: "asc" | "desc";
    },
    token?: string
  ): Promise<{ adjustments: StockAdjustment[]; total: number }> => {
    try {
      const response = await api.get(`/stock-adjustments`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data
      ) {
        console.log("ini data adjustment guys", response.data);
        return (
          response.data as {
            data: { adjustments: StockAdjustment[]; total: number };
          }
        ).data;
      }
      // fallback
      return { adjustments: [], total: 0 };
    } catch (err) {
      console.log(err);
      return { adjustments: [], total: 0 };
    }
  },
  create: async (
    data: {
      productId: string;
      userId: string;
      quantityChange: number;
      reason: string;
    },
    token?: string
  ): Promise<StockAdjustment> => {
    try {
      const response = await api.post(`/stock-adjustments`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data
      ) {
        return (response.data as { data: StockAdjustment }).data;
      }
      throw new Error("Gagal membuat penyesuaian stok: response tidak valid");
    } catch (err) {
      console.log(err);
      throw new Error("Gagal membuat penyesuaian stok: " + err);
    }
  },
};
