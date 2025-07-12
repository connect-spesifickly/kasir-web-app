import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface AdjustmentFiltersProps {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onReset: () => void;
}

export function AdjustmentFilters({
  searchTerm,
  dateFrom,
  dateTo,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: AdjustmentFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Filter & Pencarian</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative flex items-end">
            <Search className="absolute left-3 md:top-8 top-[10px] h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk atau alasan..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <Label className="pb-2" htmlFor="dateFrom">
              Dari Tanggal
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
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
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={onReset} className="w-full">
              Reset Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
