import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, UpdateProductData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useCategories } from "@/hooks/use-products";
import { useState } from "react";

export const UpdateProductForm = ({
  product,
  onSubmit,
  isLoading,
  onClose,
}: {
  product: Product;
  onSubmit: (data: UpdateProductData) => void;
  isLoading: boolean;
  onClose: () => void;
}) => {
  const { categories, loading: loadingCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(
    product.categoryId || ""
  );
  const [newCategory, setNewCategory] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UpdateProductData = {
      productCode: formData.get("productCode") as string,
      productName: formData.get("productName") as string,
      price: Number(formData.get("price")),
      minStock: Number(formData.get("minStock")),
      categoryId:
        selectedCategory && selectedCategory !== "new"
          ? selectedCategory
          : undefined,
      categoryName: selectedCategory === "new" ? newCategory : undefined,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Kategori Produk */}
      <div className="space-y-2">
        <Label htmlFor="categoryId" className="font-medium">
          Kategori
        </Label>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          disabled={loadingCategories}
          name="categoryId"
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
            <SelectItem value="new">Tambah Kategori Baru</SelectItem>
          </SelectContent>
        </Select>
        {selectedCategory === "new" && (
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Nama kategori baru"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              autoFocus
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 ">
        <div>
          <Label className="pb-2" htmlFor="edit_productCode">
            Kode Produk
          </Label>
          <Input
            id="edit_productCode"
            name="productCode"
            defaultValue={product.productCode}
            required
          />
        </div>
        <div>
          <Label className="pb-2" htmlFor="edit_price">
            Harga Jual
          </Label>
          <Input
            id="edit_price"
            name="price"
            type="number"
            defaultValue={product.price}
            required
          />
        </div>
      </div>
      <div>
        <Label className="pb-2" htmlFor="edit_productName">
          Nama Produk
        </Label>
        <Input
          id="edit_productName"
          name="productName"
          defaultValue={product.productName}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="pb-2" htmlFor="edit_minStock">
            Stok Minimum
            <span
              className="ml-1 text-xs text-muted-foreground"
              title="Jika stok turun di bawah angka ini, produk akan masuk daftar stok menipis."
            >
              [?]
            </span>
          </Label>
          <Input
            id="edit_minStock"
            name="minStock"
            type="number"
            min={1}
            defaultValue={product.minStock ?? 5}
            placeholder="e.g. 5"
            required
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Harga Beli saat ini: {formatRupiah(product.costPrice)}</p>
        <p>Stok saat ini: {product.stock} unit</p>
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
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  );
};
