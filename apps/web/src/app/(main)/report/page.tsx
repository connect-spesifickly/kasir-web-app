"use client";

import { useState, useEffect } from "react";
import { ReportHeader } from "./_components/report-header";
import { DateFilter } from "./_components/date-filter";
import { FinancialSummary } from "./_components/financial-summary";
import { StockAdjustmentList } from "./_components/stock-adjustment-list";
import { useReportData } from "@/hooks/use-report";

export default function BusinessReportPage() {
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const { reportData, stockAdjustments, loading, refreshing, fetchReports } =
    useReportData(dateFrom, dateTo);

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <ReportHeader
        reportData={reportData}
        dateFrom={dateFrom}
        dateTo={dateTo}
        stockAdjustments={stockAdjustments}
      />

      <div className="flex flex-1 flex-col gap-4 p-4 md:py-6">
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
