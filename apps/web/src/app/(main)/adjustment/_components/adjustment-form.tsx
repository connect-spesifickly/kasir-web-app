import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { ADJUSTMENT_REASONS } from "@/types/stock-adjustment";
import type { StockAdjustmentCreateData } from "@/types/stock-adjustment";
import { useSession } from "next-auth/react";
import type { Product } from "@/lib/types";

interface AdjustmentFormProps {
  products: Product[];
  productsLoading: boolean;
  onSubmit: (data: StockAdjustmentCreateData) => Promise<void>;
  onCancel: () => void;
}

export function AdjustmentForm({
  products,
  productsLoading,
  onSubmit,
  onCancel,
}: AdjustmentFormProps) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantityChange, setQuantityChange] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const handleSubmit = async () => {
    if (!selectedProduct || !quantityChange || !selectedReason) {
      return;
    }
    setIsSubmitting(true);
    try {
      const reason =
        selectedReason === "other"
          ? customReason
          : ADJUSTMENT_REASONS.find((r) => r.value === selectedReason)?.label ||
            "";
      await onSubmit({
        productId: selectedProduct,
        userId: session?.id as string,
        quantityChange: parseInt(quantityChange),
        reason,
      });

      // Reset form
      setSelectedProduct("");
      setQuantityChange("");
      setSelectedReason("");
      setCustomReason("");
    } catch (error) {
      console.error("Error creating stock adjustment:", error);
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    selectedProduct &&
    quantityChange &&
    selectedReason &&
    (selectedReason !== "other" || customReason.trim());

  return (
    <div className="space-y-4">
      <div>
        <Label className="pb-2" htmlFor="product">
          Pilih Produk
        </Label>
        {productsLoading ? (
          <div className="p-2">
            <span className="text-muted-foreground text-sm">
              Memuat produk...
            </span>
          </div>
        ) : (
          <SearchableDropdown
            options={products.map((product) => ({
              value: product.id,
              label: product.productName,
              description: `Kode: ${product.productCode}`,
              badge: `Stok: ${product.stock}`,
            }))}
            value={selectedProduct}
            onValueChange={setSelectedProduct}
            placeholder="Pilih produk..."
            searchPlaceholder="Cari nama produk..."
            disabled={productsLoading}
          />
        )}
      </div>

      <div>
        <Label className="pb-2" htmlFor="quantityChange">
          Perubahan Jumlah
        </Label>
        <Input
          id="quantityChange"
          type="number"
          placeholder="Masukkan angka (+ untuk tambah, - untuk kurang)"
          value={quantityChange}
          onChange={(e) => setQuantityChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Contoh: +10 untuk menambah, -5 untuk mengurangi
        </p>
      </div>

      <div>
        <Label className="pb-2" htmlFor="reason">
          Alasan
        </Label>
        <Select value={selectedReason} onValueChange={setSelectedReason}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih alasan..." />
          </SelectTrigger>
          <SelectContent>
            {ADJUSTMENT_REASONS.map((reason) => (
              <SelectItem key={reason.value} value={reason.value}>
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedReason === "other" && (
        <div>
          <Label className="pb-2" htmlFor="customReason">
            Alasan Lainnya
          </Label>
          <Textarea
            id="customReason"
            placeholder="Jelaskan alasan penyesuaian..."
            value={customReason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setCustomReason(e.target.value)
            }
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormValid}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Buat Penyesuaian"
          )}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </div>
  );
}
