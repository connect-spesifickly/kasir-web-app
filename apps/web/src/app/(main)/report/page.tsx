"use client";

import { useState, useEffect } from "react";
import { DateFilter } from "./_components/date-filter";
import { FinancialSummary } from "./_components/financial-summary";
import { StockAdjustmentList } from "./_components/stock-adjustment-list";
import { useReportData } from "@/hooks/use-report";
import { ReportHeader } from "./_components/report-header";

export default function BusinessReportPage() {
  // State untuk filter input (sementara)
  const [filterDateFrom, setFilterDateFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 2); // 2 hari yang lalu
    return date.toISOString().split("T")[0];
  });
  const [filterDateTo, setFilterDateTo] = useState(
    () => new Date().toISOString().split("T")[0] // hari ini
  );
  // State untuk fetch data (hanya berubah saat Terapkan Filter)
  const [dateFrom, setDateFrom] = useState(filterDateFrom);
  const [dateTo, setDateTo] = useState(filterDateTo);

  const {
    reportData,
    stockAdjustments,
    loading,
    refreshing,
    fetchReports,
    dailyTransactions,
  } = useReportData(dateFrom, dateTo);

  // Hanya fetch sekali di awal
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handler Terapkan Filter
  const handleApplyFilter = () => {
    setDateFrom(filterDateFrom);
    setDateTo(filterDateTo);
    // fetchReports akan otomatis jalan karena dependency dateFrom/dateTo berubah
  };

  return (
    <div className="w-full h-full relative">
      <div className="sticky top-16  z-40 bg-background border-b ">
        <ReportHeader
          reportData={reportData}
          dateFrom={dateFrom}
          dateTo={dateTo}
          stockAdjustments={stockAdjustments}
          loading={loading}
        />
      </div>
      <div className="flex flex-col gap-4 p-2 md:p-6">
        <div className="space-y-6">
          <DateFilter
            dateFrom={filterDateFrom}
            dateTo={filterDateTo}
            onDateFromChange={setFilterDateFrom}
            onDateToChange={setFilterDateTo}
            onApplyFilter={handleApplyFilter}
            loading={loading}
            refreshing={refreshing}
          />

          <FinancialSummary
            reportData={reportData}
            dateFrom={dateFrom}
            dateTo={dateTo}
            loading={loading}
            dailyTransactions={dailyTransactions}
          />

          <StockAdjustmentList
            stockAdjustments={stockAdjustments}
            totalLossValue={reportData.totalLossValue}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
