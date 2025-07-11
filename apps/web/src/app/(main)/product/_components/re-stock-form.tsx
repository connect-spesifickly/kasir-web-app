import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, RestockData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import * as React from "react";
export const RestockForm = ({
  product,
  onSubmit,
  isLoading,
  onClose,
}: {
  product: Product;
  onSubmit: (data: RestockData) => void;
  isLoading: boolean;
  onClose: () => void;
}) => {
  const [quantityAdded, setQuantityAdded] = React.useState("");
  const [newCostPrice, setNewCostPrice] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantityAdded || !newCostPrice) return;

    onSubmit({
      quantityAdded: Number(quantityAdded),
      newCostPrice: Number(newCostPrice),
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <p className="font-medium">{product.productName}</p>
        <p className="text-sm text-muted-foreground">
          Stok saat ini: {product.stock} unit
        </p>
        <p className="text-sm text-muted-foreground">
          Harga beli saat ini: Rp {product.costPrice.toLocaleString()}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-[10px]">
          <div>
            <Label className="pb-2" htmlFor="quantityAdded">
              Jumlah Tambahan
            </Label>
            <Input
              id="quantityAdded"
              type="number"
              placeholder="Masukkan jumlah"
              value={quantityAdded}
              onChange={(e) => setQuantityAdded(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="pb-2" htmlFor="newCostPrice">
              Harga Beli Baru
            </Label>
            <Input
              id="newCostPrice"
              type="number"
              placeholder="Harga beli"
              value={newCostPrice}
              onChange={(e) => setNewCostPrice(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Batal
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Konfirmasi Restock"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
