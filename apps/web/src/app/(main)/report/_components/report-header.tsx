"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StockAdjustment } from "@/hooks/use-report";

interface ReportAdjustment {
  date?: string;
  item?: string;
  quantity?: number;
  description?: string;
}

interface ReportHeaderProps {
  reportData: {
    totalOmzet: number;
    totalProfit: number;
    totalLossValue: number;
    jumlahTransaksi: number;
  };
  dateFrom: string;
  dateTo: string;
  stockAdjustments: StockAdjustment[];
}

// Helper to map StockAdjustment to ReportAdjustment
function mapStockAdjustmentToReport(adj: StockAdjustment): ReportAdjustment {
  return {
    date: adj.createdAt
      ? new Date(adj.createdAt).toLocaleDateString("id-ID")
      : "",
    item: adj.product?.productName || "",
    quantity: adj.quantityChange,
    description: adj.reason || "",
  };
}

export function ReportHeader({
  reportData,
  dateFrom,
  dateTo,
  stockAdjustments,
}: ReportHeaderProps) {
  const handleExportCSV = async () => {
    try {
      const csvContent = [
        ["Laporan Bisnis"],
        ["Periode", `${dateFrom} - ${dateTo}`],
        [""],
        ["Ringkasan Keuangan"],
        ["Total Omzet", `Rp ${reportData.totalOmzet.toLocaleString()}`],
        ["Total Laba", `Rp ${reportData.totalProfit.toLocaleString()}`],
        ["Total Transaksi", reportData.jumlahTransaksi.toString()],
        ["Kerugian Stok", `Rp ${reportData.totalLossValue.toLocaleString()}`],
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `laporan-bisnis-${dateFrom}-${dateTo}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast("Laporan telah diunduh dalam format CSV");
    } catch {
      toast("Gagal mengexport laporan CSV");
    }
  };

  const handleExportExcel = async () => {
    try {
      // Import XLSX library dynamically
      const XLSX = await import("xlsx");

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Create main report data
      const reportWsData = [
        ["Laporan Bisnis"],
        [`Periode: ${dateFrom} - ${dateTo}`],
        [""],
        ["Ringkasan Keuangan"],
        ["Total Omzet", reportData.totalOmzet],
        ["Total Laba", reportData.totalProfit],
        ["Total Transaksi", reportData.jumlahTransaksi],
        ["Kerugian Stok", reportData.totalLossValue],
      ];

      // Add stock adjustments if available
      if (stockAdjustments && stockAdjustments.length > 0) {
        reportWsData.push([""]);
        reportWsData.push(["Penyesuaian Stok"]);
        reportWsData.push(["Tanggal", "Item", "Jumlah", "Keterangan"]);

        stockAdjustments.forEach((adj) => {
          const mapped = mapStockAdjustmentToReport(adj);
          reportWsData.push([
            mapped.date || "",
            mapped.item || "",
            mapped.quantity || 0,
            mapped.description || "",
          ]);
        });
      }

      const ws = XLSX.utils.aoa_to_sheet(reportWsData);

      // Set column widths
      ws["!cols"] = [
        { width: 20 },
        { width: 20 },
        { width: 15 },
        { width: 30 },
      ];

      // Format currency cells
      const currencyStyle = { numFmt: '"Rp"#,##0' };
      if (ws["B5"]) ws["B5"].z = currencyStyle.numFmt;
      if (ws["B6"]) ws["B6"].z = currencyStyle.numFmt;
      if (ws["B8"]) ws["B8"].z = currencyStyle.numFmt;

      XLSX.utils.book_append_sheet(wb, ws, "Laporan Bisnis");

      // Write and download
      XLSX.writeFile(wb, `laporan-bisnis-${dateFrom}-${dateTo}.xlsx`);

      toast("Laporan telah diunduh dalam format Excel");
    } catch (error) {
      console.error("Excel export error:", error);
      toast("Gagal mengexport laporan Excel");
    }
  };

  const handleExportPDF = async () => {
    try {
      // Import jsPDF library dynamically
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF();

      // Set font
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Laporan Bisnis", 20, 30);

      // Period
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Periode: ${dateFrom} - ${dateTo}`, 20, 45);

      // Financial summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Ringkasan Keuangan", 20, 65);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const yStart = 80;
      const lineHeight = 8;

      const financialData = [
        `Total Omzet: Rp ${reportData.totalOmzet.toLocaleString()}`,
        `Total Laba: Rp ${reportData.totalProfit.toLocaleString()}`,
        `Total Transaksi: ${reportData.jumlahTransaksi}`,
        `Kerugian Stok: Rp ${reportData.totalLossValue.toLocaleString()}`,
      ];

      financialData.forEach((item, index) => {
        doc.text(item, 20, yStart + index * lineHeight);
      });

      // Add stock adjustments if available
      if (stockAdjustments && stockAdjustments.length > 0) {
        let currentY = yStart + financialData.length * lineHeight + 20;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Penyesuaian Stok", 20, currentY);

        currentY += 15;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        // Table headers
        doc.text("Tanggal", 20, currentY);
        doc.text("Item", 60, currentY);
        doc.text("Jumlah", 120, currentY);
        doc.text("Keterangan", 150, currentY);

        currentY += 10;

        stockAdjustments.slice(0, 20).forEach((adj) => {
          if (currentY > 270) {
            // Check if we need a new page
            doc.addPage();
            currentY = 30;
          }

          const mapped = mapStockAdjustmentToReport(adj);
          doc.text(mapped.date || "", 20, currentY);
          doc.text(mapped.item || "", 60, currentY);
          doc.text(mapped.quantity?.toString() ?? "0", 120, currentY);
          doc.text(mapped.description || "", 150, currentY);
          currentY += 8;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Halaman ${i} dari ${pageCount}`, 170, 285);
        doc.text(
          `Dibuat pada: ${new Date().toLocaleDateString("id-ID")}`,
          20,
          285
        );
      }

      doc.save(`laporan-bisnis-${dateFrom}-${dateTo}.pdf`);

      toast("Laporan telah diunduh dalam format PDF");
    } catch (error) {
      console.error("PDF export error:", error);
      toast("Gagal mengexport laporan PDF");
    }
  };

  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-b px-2 ">
      <div className="flex items-center justify-between flex-1">
        <h1 className="text-2xl md:text-3xl font-bold  md:px-5 font-[stencil]">
          Laporan Bisnis
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:mr-4">
            <Button variant="outline">
              <Download className="h-4 w-4 md:mr-2" />
              <div className="hidden sm:block"> Export Laporan</div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportCSV}>
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
