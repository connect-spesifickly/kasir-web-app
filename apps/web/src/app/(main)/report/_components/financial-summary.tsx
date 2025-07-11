"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ChevronDown,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { MetricCard } from "./metric-card";

interface FinancialSummaryProps {
  reportData: {
    totalOmzet: number;
    totalProfit: number;
    totalLossValue: number;
    jumlahTransaksi: number;
  };
  dateFrom: string;
  dateTo: string;
  loading: boolean;
  dailyTransactions?: Array<{
    date: string;
    revenue: number;
    profit: number;
    loss: number;
    transactionCount: number;
  }>;
}

export function FinancialSummary({
  reportData,
  dateFrom,
  dateTo,
  loading,
  dailyTransactions = [],
}: FinancialSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProfitMargin = () => {
    if (reportData.totalOmzet === 0) return 0;
    return ((reportData.totalProfit / reportData.totalOmzet) * 100).toFixed(2);
  };

  const getChartData = () => {
    // Jika ada data transaksi sebenarnya, gunakan hanya data yang ada
    if (dailyTransactions.length > 0) {
      return dailyTransactions
        .filter(
          (transaction) =>
            transaction.revenue > 0 ||
            transaction.profit > 0 ||
            transaction.loss > 0
        )
        .map((transaction) => ({
          date: new Date(transaction.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
          revenue: transaction.revenue,
          profit: transaction.profit,
          loss: transaction.loss,
        }));
    }

    // Fallback: jika tidak ada data transaksi, return empty array
    return [];
  };

  // Fungsi untuk menampilkan chart mingguan jika range > 7 hari
  const getWeeklyChartData = () => {
    if (dailyTransactions.length === 0) return [];

    // Filter hanya transaksi yang memiliki data (revenue, profit, atau loss > 0)
    const validTransactions = dailyTransactions.filter(
      (transaction) =>
        transaction.revenue > 0 ||
        transaction.profit > 0 ||
        transaction.loss > 0
    );

    if (validTransactions.length === 0) return [];

    // Group transaksi per minggu
    const weeklyData = validTransactions.reduce(
      (acc, transaction) => {
        const date = new Date(transaction.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)

        const weekKey = weekStart.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        });

        if (!acc[weekKey]) {
          acc[weekKey] = {
            date: weekKey,
            revenue: 0,
            profit: 0,
            loss: 0,
          };
        }

        acc[weekKey].revenue += transaction.revenue;
        acc[weekKey].profit += transaction.profit;
        acc[weekKey].loss += transaction.loss;
        return acc;
      },
      {} as Record<
        string,
        { date: string; revenue: number; profit: number; loss: number }
      >
    );

    return Object.values(weeklyData).sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.date + " 2024"); // Add year for proper sorting
      const dateB = new Date(b.date + " 2024");
      return dateA.getTime() - dateB.getTime();
    });
  };

  const shouldShowWeeklyView = () => {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Filter transaksi yang valid
    const validTransactions = dailyTransactions.filter(
      (transaction) =>
        transaction.revenue > 0 ||
        transaction.profit > 0 ||
        transaction.loss > 0
    );

    // Hanya tampilkan weekly view jika:
    // 1. Range lebih dari 30 hari DAN
    // 2. Ada lebih dari 7 hari yang memiliki transaksi
    const daysWithTransactions = validTransactions.length;
    return daysDiff > 30 && daysWithTransactions > 7;
  };

  const finalChartData = shouldShowWeeklyView()
    ? getWeeklyChartData()
    : getChartData();

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Ringkasan Keuangan
              </span>
              <ChevronDown className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Omzet"
            value={formatCurrency(reportData.totalOmzet)}
            subtitle="Revenue"
            icon={TrendingUp}
            color="text-green-600"
            borderColor="border-l-green-500"
            loading={loading}
          />

          <MetricCard
            title="Total Laba"
            value={formatCurrency(reportData.totalProfit)}
            subtitle={`Margin: ${calculateProfitMargin()}%`}
            icon={DollarSign}
            color="text-blue-600"
            borderColor="border-l-blue-500"
            loading={loading}
          />

          <MetricCard
            title="Total Transaksi"
            value={reportData.jumlahTransaksi.toLocaleString()}
            subtitle={`Avg: ${reportData.jumlahTransaksi > 0 ? formatCurrency(reportData.totalOmzet / reportData.jumlahTransaksi) : "Rp 0"}`}
            icon={TrendingUp}
            color="text-purple-600"
            borderColor="border-l-purple-500"
            loading={loading}
          />

          <MetricCard
            title="Kerugian Stok"
            value={formatCurrency(reportData.totalLossValue)}
            subtitle="Penyesuaian"
            icon={TrendingDown}
            color="text-red-600"
            borderColor="border-l-red-500"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Tren Omzet & Laba{" "}
                {shouldShowWeeklyView() ? "(Mingguan)" : "(Harian)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {finalChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={finalChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          name === "revenue" ? "Omzet" : "Laba",
                        ]}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" name="revenue" />
                      <Bar dataKey="profit" fill="#10b981" name="profit" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Tidak ada data transaksi untuk periode ini
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Tren Kerugian{" "}
                {shouldShowWeeklyView() ? "(Mingguan)" : "(Harian)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {finalChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={finalChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          "Kerugian",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="loss"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: "#ef4444" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Tidak ada data kerugian untuk periode ini
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
