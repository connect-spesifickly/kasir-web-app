"use client";

import { useState, useEffect, useCallback } from "react";
import type { StockAdjustment } from "@/types/stock-adjustment";
import { stockAdjustmentApi } from "@/lib/api/stock-adjustment";
import { toast } from "sonner";

// Types
interface UseStockAdjustmentParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  take?: number;
  skip?: number;
}

interface CreateAdjustmentData {
  productId: string;
  userId: string;
  quantityChange: number;
  reason: string;
}

interface UseStockAdjustmentReturn {
  adjustments: StockAdjustment[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  createAdjustment: (data: CreateAdjustmentData) => Promise<StockAdjustment>;
  reset: () => void;
}

// Constants
const DEFAULT_TAKE = 50;
const DEFAULT_SKIP = 0;

export function useStockAdjustments(
  params?: UseStockAdjustmentParams
): UseStockAdjustmentReturn {
  // State
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Memoized fetch function
  const fetchAdjustments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await stockAdjustmentApi.getAll({
        search: params?.search,
        startDate: params?.startDate,
        endDate: params?.endDate,
        take: params?.take || DEFAULT_TAKE,
        skip: params?.skip || DEFAULT_SKIP,
      });
      setAdjustments(response.adjustments);
      setTotal(response.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch stock adjustments";
      setError(errorMessage);

      toast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    params?.search,
    params?.startDate,
    params?.endDate,
    params?.take,
    params?.skip,
  ]);

  // Effect for fetching data
  useEffect(() => {
    fetchAdjustments();
  }, [fetchAdjustments]);

  // Create adjustment function
  const createAdjustment = useCallback(
    async (data: CreateAdjustmentData): Promise<StockAdjustment> => {
      try {
        const newAdjustment = await stockAdjustmentApi.create(data);

        // Optimistically update the list
        setAdjustments((prev) => [newAdjustment, ...prev]);
        setTotal((prev) => prev + 1);

        toast("Penyesuaian stok berhasil dibuat");

        return newAdjustment;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create stock adjustment";

        toast(errorMessage);

        throw err;
      }
    },
    []
  );

  // Reset function
  const reset = useCallback(() => {
    setAdjustments([]);
    setError(null);
    setTotal(0);
  }, []);

  return {
    adjustments,
    loading,
    error,
    total,
    refetch: fetchAdjustments,
    createAdjustment,
    reset,
  };
}
