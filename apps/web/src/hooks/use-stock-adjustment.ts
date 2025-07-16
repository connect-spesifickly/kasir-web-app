"use client";

import { stockAdjustmentApi } from "@/lib/api/stock-adjustment";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetchAdjustmentsApi = async (
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
) => {
  const response = await stockAdjustmentApi.getAll(
    {
      search: params?.search,
      startDate: params?.startDate,
      endDate: params?.endDate,
      take: params?.take || 50,
      skip: params?.skip || 0,
      orderBy: params?.orderBy,
      orderDirection: params?.orderDirection,
    },
    token
  );
  return {
    adjustments: response.adjustments,
    total: response.total,
  };
};

export function useStockAdjustments(params?: {
  search?: string;
  startDate?: string;
  endDate?: string;
  take?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}) {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const swrKey =
    status === "authenticated" ? ["stock-adjustments", params, token] : null;
  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => fetchAdjustmentsApi(params || {}, token),
    { revalidateOnFocus: false }
  );

  const createAdjustment = async (dataInput: {
    productId: string;
    userId: string;
    quantityChange: number;
    reason: string;
  }) => {
    try {
      const newAdjustment = await stockAdjustmentApi.create(dataInput, token);
      await mutate();
      toast("Penyesuaian stok berhasil dibuat");
      return newAdjustment;
    } catch (err) {
      toast("Penyesuaian stok gagal dibuat");
      throw err;
    }
  };

  const reset = () => {
    mutate();
  };

  return {
    adjustments: data?.adjustments || [],
    loading: isLoading,
    error,
    total: data?.total || 0,
    refetch: mutate,
    createAdjustment,
    reset,
  };
}
