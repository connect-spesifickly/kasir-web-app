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
}

export function FinancialSummary({
  reportData,
  dateFrom,
  dateTo,
  loading,
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
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 7) {
      const chartData = [];
      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        chartData.push({
          date: date.toISOString().split("T")[0],
          revenue: Math.floor(reportData.totalOmzet / (daysDiff + 1)),
          profit: Math.floor(reportData.totalProfit / (daysDiff + 1)),
          loss: Math.floor(reportData.totalLossValue / (daysDiff + 1)),
        });
      }
      return chartData;
    } else {
      return [
        {
          date: "Minggu 1",
          revenue: Math.floor(reportData.totalOmzet * 0.3),
          profit: Math.floor(reportData.totalProfit * 0.3),
          loss: Math.floor(reportData.totalLossValue * 0.3),
        },
        {
          date: "Minggu 2",
          revenue: Math.floor(reportData.totalOmzet * 0.4),
          profit: Math.floor(reportData.totalProfit * 0.4),
          loss: Math.floor(reportData.totalLossValue * 0.4),
        },
        {
          date: "Minggu 3",
          revenue: Math.floor(reportData.totalOmzet * 0.2),
          profit: Math.floor(reportData.totalProfit * 0.2),
          loss: Math.floor(reportData.totalLossValue * 0.2),
        },
        {
          date: "Minggu 4",
          revenue: Math.floor(reportData.totalOmzet * 0.1),
          profit: Math.floor(reportData.totalProfit * 0.1),
          loss: Math.floor(reportData.totalLossValue * 0.1),
        },
      ];
    }
  };

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
              <CardTitle>Tren Omzet & Laba</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()}>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tren Kerugian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
