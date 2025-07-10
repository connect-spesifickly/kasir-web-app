import { useState } from "react";
import { toast } from "sonner";
import { reportApi, stockAdjustmentApi } from "@/lib/utils";

interface ReportData {
  totalOmzet: number;
  jumlahTransaksi: number;
  totalProfit: number;
  totalLossValue: number;
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      setRefreshing(true);
      const [salesReport, profitReport, lossesReport] = await Promise.all([
        reportApi.getSalesReport(dateFrom, dateTo) as Promise<{
          totalOmzet: number;
          jumlahTransaksi: number;
        }>,
        reportApi.getProfitReport(dateFrom, dateTo) as Promise<{
          totalProfit: number;
        }>,
        reportApi.getLossesReport(dateFrom, dateTo) as Promise<{
          totalLossValue: number;
        }>,
      ]);

      setReportData({
        totalOmzet: salesReport.totalOmzet || 0,
        jumlahTransaksi: salesReport.jumlahTransaksi || 0,
        totalProfit: profitReport.totalProfit || 0,
        totalLossValue: lossesReport.totalLossValue || 0,
      });

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
  };
}
