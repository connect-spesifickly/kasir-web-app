import { useState } from "react";
import { toast } from "sonner";
import { reportApi, stockAdjustmentApi } from "@/lib/utils";
import { useSession } from "next-auth/react";

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

export interface StockAdjustment {
  id: string;
  productId: string;
  userId: string;
  quantityChange: number;
  lastStock: number;
  reason: string;
  createdAt: string;
  product: {
    id: string;
    productName: string;
    costPrice: number;
  };
  user: {
    id: string;
    email: string;
  };
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
  const { data: session } = useSession();
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
      console.log(
        "hasil report",
        salesReport.data,
        profitReport.data,
        lossesReport.data,
        dailyTransactionsRes.data
      );
      setReportData({
        totalOmzet: salesReport.data.totalOmzet || 0,
        jumlahTransaksi: salesReport.data.jumlahTransaksi || 0,
        totalProfit: profitReport.data.totalProfit || 0,
        totalLossValue: lossesReport.data.totalLossValue || 0,
      });
      setDailyTransactions(dailyTransactionsRes.data || []);

      try {
        const adjustmentsData = (await stockAdjustmentApi.getAll({
          startDate: dateFrom,
          endDate: dateTo,
          take: 10,
        })) as { adjustments?: StockAdjustment[] };
        setStockAdjustments(adjustmentsData.adjustments || []);
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

  return {
    reportData,
    stockAdjustments,
    loading,
    refreshing,
    fetchReports,
    dailyTransactions,
  };
}
