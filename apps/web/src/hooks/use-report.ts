import { useState, useEffect } from "react";
import { toast } from "sonner";
import { reportApi } from "@/lib/api/report";
import { stockAdjustmentApi } from "@/lib/api/stock-adjustment";
import { useSession } from "next-auth/react";
import type { StockAdjustment } from "@/types/stock-adjustment";

interface ReportData {
  totalOmzet: number;
  jumlahTransaksi: number;
  totalProfit: number;
  totalLossValue: number;
}

export interface DailyTransaction {
  date: string;
  revenue: number;
  profit: number;
  loss: number;
  transactionCount: number;
}

export function useReportData(dateFrom: string, dateTo: string) {
  const [reportData, setReportData] = useState<ReportData>({
    totalOmzet: 0,
    totalProfit: 0,
    totalLossValue: 0,
    jumlahTransaksi: 0,
  });
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>(
    []
  );
  const [dailyTransactions, setDailyTransactions] = useState<
    DailyTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const fetchReports = async () => {
    try {
      setRefreshing(true);
      const [salesReport, profitReport, lossesReport, dailyTransactionsRes] =
        await Promise.all([
          reportApi.getSalesReport(
            dateFrom,
            dateTo,
            session?.accessToken
          ) as Promise<{
            data: { totalOmzet: number; jumlahTransaksi: number };
          }>,
          reportApi.getProfitReport(
            dateFrom,
            dateTo,
            session?.accessToken
          ) as Promise<{ data: { totalProfit: number } }>,
          reportApi.getLossesReport(
            dateFrom,
            dateTo,
            session?.accessToken
          ) as Promise<{ data: { totalLossValue: number } }>,
          reportApi.getDailyTransactions(
            dateFrom,
            dateTo,
            session?.accessToken
          ) as Promise<{ data: DailyTransaction[] }>,
        ]);
      setReportData({
        totalOmzet: salesReport.data.totalOmzet || 0,
        jumlahTransaksi: salesReport.data.jumlahTransaksi || 0,
        totalProfit: profitReport.data.totalProfit || 0,
        totalLossValue: lossesReport.data.totalLossValue || 0,
      });
      setDailyTransactions(dailyTransactionsRes.data || []);

      try {
        const { adjustments } = await stockAdjustmentApi.getAll(
          {
            startDate: dateFrom,
            endDate: dateTo,
            take: 10,
          },
          session?.accessToken
        );
        setStockAdjustments(adjustments);
      } catch (error) {
        console.warn("Failed to fetch stock adjustments:", error);
        setStockAdjustments([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast("Gagal memuat data laporan. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Only fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated]);

  return {
    reportData,
    stockAdjustments,
    loading,
    refreshing,
    fetchReports,
    dailyTransactions,
  };
}
