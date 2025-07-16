import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateProductData } from "@/lib/types";
import { Loader2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCategories } from "@/hooks/use-products";
import { useState } from "react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CreateProductForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: CreateProductData) => void;
  isLoading: boolean;
}) => {
  const { categories, loading: loadingCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

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
        <label htmlFor="categoryId" className="font-medium">
          Kategori
        </label>
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
      {/* Info Produk */}
      <div className="space-y-2">
        <Label htmlFor="productCode">Kode Produk</Label>
        <Input
          id="productCode"
          name="productCode"
          placeholder="KOP001"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="productName">Nama Produk</Label>
        <Input
          id="productName"
          name="productName"
          placeholder="Kopi Arabica 250g"
          required
        />
      </div>
      {/* Harga Beli & Harga Jual */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPrice">Harga Beli</Label>
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            placeholder="35000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Harga Jual</Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="45000"
            required
          />
        </div>
      </div>
      {/* Stok Awal & Stok Minimum */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stok Awal</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            placeholder="25"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="minStock">Stok Minimum</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Batas stok terendah sebelum produk dianggap perlu
                    di-restock.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
