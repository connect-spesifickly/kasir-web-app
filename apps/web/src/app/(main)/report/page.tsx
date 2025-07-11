"use client";

import { useState, useEffect } from "react";
import { DateFilter } from "./_components/date-filter";
import { FinancialSummary } from "./_components/financial-summary";
import { StockAdjustmentList } from "./_components/stock-adjustment-list";
import { useReportData } from "@/hooks/use-report";
import { ReportHeader } from "./_components/report-header";

export default function BusinessReportPage() {
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const {
    reportData,
    stockAdjustments,
    loading,
    refreshing,
    fetchReports,
    dailyTransactions,
  } = useReportData(dateFrom, dateTo);

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-[92vh] lg:border-l-2 pb-12 md:pb-0">
      <ReportHeader
        reportData={reportData}
        dateFrom={dateFrom}
        dateTo={dateTo}
        stockAdjustments={stockAdjustments}
      />
      <div className="flex flex-1 flex-col gap-4 p-2 md:p-6">
        <div className="space-y-6">
          <DateFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onApplyFilter={fetchReports}
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
