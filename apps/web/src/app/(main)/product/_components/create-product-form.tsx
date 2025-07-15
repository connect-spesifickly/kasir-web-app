import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateProductData } from "@/lib/types";
import { Loader2 } from "lucide-react";

export const CreateProductForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: CreateProductData) => void;
  isLoading: boolean;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateProductData = {
      productCode: formData.get("productCode") as string,
      productName: formData.get("productName") as string,
      price: Number(formData.get("price")),
      costPrice: Number(formData.get("costPrice")),
      stock: Number(formData.get("stock")),
      minStock: Number(formData.get("minStock")),
      isActive: true,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="pb-2" htmlFor="productCode">
            Kode Produk
          </Label>
          <Input
            id="productCode"
            name="productCode"
            placeholder="KOP001"
            required
          />
        </div>
        <div>
          <Label className="pb-2" htmlFor="price">
            Harga Jual
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="45000"
            required
          />
        </div>
      </div>
      <div>
        <Label className="pb-2" htmlFor="productName">
          Nama Produk
        </Label>
        <Input
          id="productName"
          name="productName"
          placeholder="Kopi Arabica 250g"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="pb-2" htmlFor="costPrice">
            Harga Beli
          </Label>
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            placeholder="35000"
            required
          />
        </div>
        <div>
          <Label className="pb-2" htmlFor="stock">
            Stok Awal
          </Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>
      <div>
        <Label className="pb-2" htmlFor="minStock">
          Stok Minimum
          <span
            className="ml-1 text-xs text-muted-foreground"
            title="Jika stok turun di bawah angka ini, produk akan masuk daftar stok menipis."
          >
            [?]
          </span>
        </Label>
        <Input
          id="minStock"
          name="minStock"
          type="number"
          min={1}
          defaultValue={5}
          placeholder="5"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menambahkan...
          </>
        ) : (
          "Tambah Produk"
        )}
      </Button>
    </form>
  );
};
