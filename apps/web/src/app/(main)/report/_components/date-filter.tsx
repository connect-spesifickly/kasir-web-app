"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onApplyFilter: () => void;
  loading: boolean;
  refreshing: boolean;
}

export function DateFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onApplyFilter,
  loading,
  refreshing,
}: DateFilterProps) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Filter Periode Laporan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label className="pb-2" htmlFor="dateFrom">
              Dari Tanggal
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              max={dateTo}
              className="!pr-3"
            />
          </div>
          <div>
            <Label className="pb-2" htmlFor="dateTo">
              Sampai Tanggal
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              min={dateFrom}
              max={new Date().toISOString().split("T")[0]}
              className="!pr-3"
            />
          </div>
          <Button onClick={onApplyFilter} disabled={loading || refreshing}>
            {loading || refreshing ? "Memuat..." : "Terapkan Filter"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
