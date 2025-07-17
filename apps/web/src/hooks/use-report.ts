import { reportApi } from "@/lib/api/report";
import { stockAdjustmentApi } from "@/lib/api/stock-adjustment";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import type { StockAdjustment } from "@/types/stock-adjustment";

export interface DailyTransaction {
  date: string;
  revenue: number;
  profit: number;
  loss: number;
  transactionCount: number;
}

const fetchReportApi = async (
  dateFrom: string,
  dateTo: string,
  token?: string
) => {
  const [salesReport, profitReport, lossesReport, dailyTransactionsRes] =
    await Promise.all([
      reportApi.getSalesReport(dateFrom, dateTo, token) as Promise<{
        data: { totalOmzet: number; jumlahTransaksi: number };
      }>,
      reportApi.getProfitReport(dateFrom, dateTo, token) as Promise<{
        data: { totalProfit: number };
      }>,
      reportApi.getLossesReport(dateFrom, dateTo, token) as Promise<{
        data: { totalLossValue: number };
      }>,
      reportApi.getDailyTransactions(dateFrom, dateTo, token) as Promise<{
        data: DailyTransaction[];
      }>,
    ]);
  let stockAdjustments: StockAdjustment[] = [];
  try {
    const { adjustments } = await stockAdjustmentApi.getAll(
      {
        startDate: dateFrom,
        endDate: dateTo,
        take: 100,
      },
      token
    );
    stockAdjustments = adjustments;
  } catch {
    stockAdjustments = [];
  }
  return {
    reportData: {
      totalOmzet: salesReport.data.totalOmzet || 0,
      jumlahTransaksi: salesReport.data.jumlahTransaksi || 0,
      totalProfit: profitReport.data.totalProfit || 0,
      totalLossValue: lossesReport.data.totalLossValue || 0,
    },
    stockAdjustments,
    dailyTransactions: dailyTransactionsRes.data || [],
  };
};

export function useReportData(dateFrom: string, dateTo: string) {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const swrKey =
    status === "authenticated" ? ["report", dateFrom, dateTo, token] : null;
  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => fetchReportApi(dateFrom, dateTo, token),
    { revalidateOnFocus: false }
  );
  return {
    reportData: data?.reportData || {
      totalOmzet: 0,
      totalProfit: 0,
      totalLossValue: 0,
      jumlahTransaksi: 0,
    },
    stockAdjustments: data?.stockAdjustments || [],
    loading: isLoading,
    refreshing: isLoading,
    fetchReports: mutate,
    dailyTransactions: data?.dailyTransactions || [],
    error,
  };
}
