"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StockAdjustment } from "@/types/stock-adjustment";
import { api } from "@/utils/axios";
import { useSession } from "next-auth/react";
import { formatRupiah } from "@/lib/utils";

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

type SalesDetail = {
  transactionDate: string;
  invoiceNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  priceAtSale: number;
  costAtSale: number;
  subtotal: number;
  totalProfit: number;
};

type StockAdjustmentCSV = {
  createdAt: string;
  product: { productName: string; costPrice: number };
  quantityChange: number;
  lastStock: number;
  reason: string;
  user: { email: string };
};

// TypeScript module augmentation for jsPDF to add lastAutoTable property
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY?: number };
  }
}

export function ReportHeader({
  reportData,
  dateFrom,
  dateTo,
}: ReportHeaderProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const handleExportCSV = async () => {
    try {
      // Fetch detail penjualan dan penyesuaian stok saja
      const salesDetailRes = await api.get<{ data: SalesDetail[] }>(
        "/sales/sales-detail",
        {
          params: { startDate: dateFrom, endDate: dateTo },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const stockAdjRes = await api.get<{
        data: { adjustments: StockAdjustmentCSV[] };
      }>("/stock-adjustments", {
        params: { startDate: dateFrom, endDate: dateTo },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Sheet 1: Ringkasan (format Rp di semua angka penting)
      const summaryRows = [
        ["Laporan Bisnis", ""],
        ["Periode", `${dateFrom} - ${dateTo}`],
        ["", ""],
        ["Ringkasan Keuangan", ""],
        ["Total Omzet", formatRupiah(reportData.totalOmzet)],
        ["Total Laba", formatRupiah(reportData.totalProfit)],
        [
          "Margin Laba",
          reportData.totalOmzet
            ? ((reportData.totalProfit / reportData.totalOmzet) * 100).toFixed(
                2
              ) + "%"
            : "0%",
        ],
        ["Total Transaksi", reportData.jumlahTransaksi],
        [
          "Rata-rata Nilai Transaksi",
          reportData.jumlahTransaksi
            ? formatRupiah(
                Math.round(reportData.totalOmzet / reportData.jumlahTransaksi)
              )
            : formatRupiah(0),
        ],
        ["Total Kerugian Stok", formatRupiah(reportData.totalLossValue)],
      ];
      const summaryCSV = summaryRows.map((row) => row.join(",")).join("\n");

      // Sheet 2: Detail Penjualan (format harga, subtotal, total laba ke Rp)
      const salesDetails = salesDetailRes.data.data as SalesDetail[];
      const salesDetailRows = [
        [
          "Tanggal Transaksi",
          "Nomor Invoice",
          "SKU / Kode Produk",
          "Nama Produk",
          "Jumlah",
          "Harga Jual (Satuan)",
          "Harga Modal (Satuan)",
          "Subtotal",
          "Total Laba",
        ],
        ...salesDetails.map((item) => [
          new Date(item.transactionDate).toLocaleDateString("id-ID"),
          item.invoiceNumber,
          item.productCode,
          item.productName,
          item.quantity,
          formatRupiah(item.priceAtSale),
          formatRupiah(item.costAtSale),
          formatRupiah(item.subtotal),
          formatRupiah(item.totalProfit),
        ]),
      ];
      const salesDetailCSV = salesDetailRows
        .map((row) => row.join(","))
        .join("\n");

      // Sheet 3: Detail Penyesuaian Stok (format Nilai Kerugian/Tambahan ke Rp)
      const stockAdjustments = (stockAdjRes.data.data.adjustments ||
        []) as StockAdjustmentCSV[];
      const stockAdjRows = [
        [
          "Tanggal",
          "Nama Produk",
          "Perubahan",
          "Stok Sebelumnya",
          "Alasan",
          "Oleh",
          "Nilai Kerugian/Tambahan",
        ],
        ...stockAdjustments.map((adj) => [
          new Date(adj.createdAt).toLocaleDateString("id-ID"),
          adj.product?.productName || "",
          adj.quantityChange,
          adj.lastStock,
          adj.reason,
          adj.user?.email || "",
          adj.reason === "Recount Stok" || adj.reason === "Retur Supplier"
            ? "0"
            : typeof adj.quantityChange && typeof adj.product?.costPrice
              ? formatRupiah(adj.quantityChange * adj.product.costPrice)
              : "",
        ]),
      ];
      const stockAdjCSV = stockAdjRows.map((row) => row.join(",")).join("\n");

      // Helper to download file
      const downloadCSV = (csv: string, filename: string) => {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      downloadCSV(summaryCSV, `laporan_ringkasan_${dateFrom}_${dateTo}.csv`);
      downloadCSV(
        salesDetailCSV,
        `laporan_penjualan_detail_${dateFrom}_${dateTo}.csv`
      );
      downloadCSV(
        stockAdjCSV,
        `laporan_penyesuaian_stok_${dateFrom}_${dateTo}.csv`
      );

      toast("3 file CSV berhasil diunduh!");
    } catch {
      toast("Gagal mengexport laporan CSV");
    }
  };

  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      // Fetch detail penjualan dan penyesuaian stok saja
      const salesDetailRes = await api.get<{ data: SalesDetail[] }>(
        "/sales/sales-detail",
        {
          params: { startDate: dateFrom, endDate: dateTo },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const stockAdjRes = await api.get<{
        data: { adjustments: StockAdjustmentCSV[] };
      }>("/stock-adjustments", {
        params: { startDate: dateFrom, endDate: dateTo },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Sheet 1: Ringkasan (formatRupiah string untuk semua angka penting)
      const summarySheet = [
        ["Laporan Bisnis", ""],
        ["Periode", `${dateFrom} - ${dateTo}`],
        ["", ""],
        ["Ringkasan Keuangan", ""],
        ["Total Omzet", formatRupiah(reportData.totalOmzet)],
        ["Total Laba", formatRupiah(reportData.totalProfit)],
        [
          "Margin Laba",
          reportData.totalOmzet
            ? ((reportData.totalProfit / reportData.totalOmzet) * 100).toFixed(
                2
              ) + "%"
            : "0%",
        ],
        ["Total Transaksi", reportData.jumlahTransaksi],
        [
          "Rata-rata Nilai Transaksi",
          reportData.jumlahTransaksi
            ? formatRupiah(
                Math.round(reportData.totalOmzet / reportData.jumlahTransaksi)
              )
            : formatRupiah(0),
        ],
        ["Total Kerugian Stok", formatRupiah(reportData.totalLossValue)],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summarySheet);

      // Sheet 2: Detail Penjualan (formatRupiah string untuk harga, subtotal, total laba)
      const salesDetails = salesDetailRes.data.data as SalesDetail[];
      const salesDetailSheet = [
        [
          "Tanggal Transaksi",
          "Nomor Invoice",
          "SKU / Kode Produk",
          "Nama Produk",
          "Jumlah",
          "Harga Jual (Satuan)",
          "Harga Modal (Satuan)",
          "Subtotal",
          "Total Laba",
        ],
        ...salesDetails.map((item) => [
          new Date(item.transactionDate).toLocaleDateString("id-ID"),
          item.invoiceNumber,
          item.productCode,
          item.productName,
          item.quantity,
          formatRupiah(item.priceAtSale),
          formatRupiah(item.costAtSale),
          formatRupiah(item.subtotal),
          formatRupiah(item.totalProfit),
        ]),
      ];
      const wsSales = XLSX.utils.aoa_to_sheet(salesDetailSheet);

      // Sheet 3: Detail Penyesuaian Stok (formatRupiah string untuk Nilai Kerugian/Tambahan)
      const stockAdjustments = (stockAdjRes.data.data.adjustments ||
        []) as StockAdjustmentCSV[];
      const stockAdjSheet = [
        [
          "Tanggal",
          "Nama Produk",
          "Perubahan",
          "Stok Sebelumnya",
          "Alasan",
          "Oleh",
          "Nilai Kerugian/Tambahan",
        ],
        ...stockAdjustments.map((adj) => [
          new Date(adj.createdAt).toLocaleDateString("id-ID"),
          adj.product?.productName || "",
          adj.quantityChange,
          adj.lastStock,
          adj.reason,
          adj.user?.email || "",
          adj.reason === "Recount Stok" || adj.reason === "Retur Supplier"
            ? "0"
            : typeof adj.quantityChange && typeof adj.product?.costPrice
              ? formatRupiah(adj.quantityChange * adj.product.costPrice)
              : "",
        ]),
      ];
      const wsAdj = XLSX.utils.aoa_to_sheet(stockAdjSheet);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");
      XLSX.utils.book_append_sheet(wb, wsSales, "Detail Penjualan");
      XLSX.utils.book_append_sheet(wb, wsAdj, "Detail Penyesuaian Stok");

      XLSX.writeFile(wb, `Laporan Bisnis ${dateFrom} - ${dateTo}.xlsx`);
      toast("Laporan Excel multi-sheet berhasil diunduh!");
    } catch (error) {
      console.error("Excel export error:", error);
      toast("Gagal mengexport laporan Excel");
    }
  };

  const handleExportPDF = async () => {
    try {
      // Import jsPDF library dynamically
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const salesDetailRes = await api.get<{ data: SalesDetail[] }>(
        "/sales/sales-detail",
        {
          params: { startDate: dateFrom, endDate: dateTo },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const stockAdjRes = await api.get<{
        data: { adjustments: StockAdjustmentCSV[] };
      }>("/stock-adjustments", {
        params: { startDate: dateFrom, endDate: dateTo },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const salesDetails = salesDetailRes.data.data as SalesDetail[];
      const stockAdjustments = (stockAdjRes.data.data.adjustments ||
        []) as StockAdjustmentCSV[];

      // Set PDF to landscape orientation
      const doc = new jsPDF({ orientation: "landscape" });

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
        `Total Omzet: ${formatRupiah(reportData.totalOmzet)}`,
        `Total Laba: ${formatRupiah(reportData.totalProfit)}`,
        `Margin Laba: ${reportData.totalOmzet ? ((reportData.totalProfit / reportData.totalOmzet) * 100).toFixed(2) + "%" : "0%"}`,
        `Total Transaksi: ${reportData.jumlahTransaksi}`,
        `Rata-rata Nilai Transaksi: ${reportData.jumlahTransaksi ? formatRupiah(Math.round(reportData.totalOmzet / reportData.jumlahTransaksi)) : formatRupiah(0)}`,
        `Total Kerugian Stok: ${formatRupiah(reportData.totalLossValue)}`,
      ];

      financialData.forEach((item, index) => {
        doc.text(item, 20, yStart + index * lineHeight);
      });

      // Detail Penjualan Table
      let currentY = yStart + financialData.length * lineHeight + 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Detail Penjualan", 20, currentY);
      currentY += 6;
      autoTable(doc, {
        startY: currentY,
        head: [
          [
            "Tanggal Transaksi",
            "Nomor Invoice",
            "SKU / Kode Produk",
            "Nama Produk",
            "Jumlah",
            "Harga Jual (Satuan)",
            "Harga Modal (Satuan)",
            "Subtotal",
            "Total Laba",
          ],
        ],
        body: salesDetails.map((item) => [
          new Date(item.transactionDate).toLocaleDateString("id-ID"),
          item.invoiceNumber,
          item.productCode,
          item.productName,
          item.quantity,
          formatRupiah(item.priceAtSale),
          formatRupiah(item.costAtSale),
          formatRupiah(item.subtotal),
          formatRupiah(item.totalProfit),
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] },
        theme: "grid",
        margin: { left: 20, right: 20 },
        tableWidth: "auto",
      });
      currentY = doc.lastAutoTable?.finalY
        ? doc.lastAutoTable.finalY + 15
        : currentY + 15;

      // Detail Penyesuaian Stok Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Detail Penyesuaian Stok", 20, currentY);
      currentY += 6;
      autoTable(doc, {
        startY: currentY,
        head: [
          [
            "Tanggal",
            "Nama Produk",
            "Perubahan",
            "Stok Sebelumnya",
            "Alasan",
            "Oleh",
            "Nilai Kerugian/Tambahan",
          ],
        ],
        body: stockAdjustments.map((adj) => [
          new Date(adj.createdAt).toLocaleDateString("id-ID"),
          adj.product?.productName || "",
          adj.quantityChange,
          adj.lastStock,
          adj.reason,
          adj.user?.email || "",
          adj.reason === "Recount Stok" || adj.reason === "Retur Supplier"
            ? "0"
            : typeof adj.quantityChange && typeof adj.product?.costPrice
              ? formatRupiah(adj.quantityChange * adj.product.costPrice)
              : "0",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [16, 185, 129] },
        theme: "grid",
        margin: { left: 20, right: 20 },
        tableWidth: "auto",
      });
      currentY = doc.lastAutoTable?.finalY
        ? doc.lastAutoTable.finalY + 10
        : currentY + 10;

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Halaman ${i} dari ${pageCount}`, 250, 200);
        doc.text(
          `Dibuat pada: ${new Date().toLocaleDateString("id-ID")}`,
          20,
          200
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
            {/* Info label for context */}
            <DropdownMenuLabel className="font-normal text-muted-foreground">
              Rincian penjualan & penyesuaian
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
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
