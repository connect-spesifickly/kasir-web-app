"use client";
import { useProducts } from "@/hooks/use-products";
import {
  CreateProductData,
  Product,
  RestockData,
  UpdateProductData,
} from "@/lib/types";
import * as React from "react";

import { SearchInput } from "./_components/search-input";
import { Card, CardContent } from "@/components/ui/card";
import { ProductTable } from "./_components/product-table";
import { ProductCards } from "./_components/mobile-product-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateProductForm } from "./_components/create-product-form";
import { UpdateProductForm } from "./_components/update-product-form";
import { RestockForm } from "./_components/re-stock-form";

import { PageHeader } from "./_components/product-header";
import { ChevronDown } from "lucide-react";
export default function ProdukPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = React.useState<Product | null>(
    null
  );
  const [isCreating, setIsCreating] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isRestocking, setIsRestocking] = React.useState(false);

  // State pagination
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(6);
  // Sorting state: default stock asc
  const [sortBy, setSortBy] = React.useState<"productName" | "stock">("stock");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );

  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deactivateProduct,
    activateProduct,
    restockProduct: restockProductApi,
    total,
  } = useProducts({
    search: searchTerm,
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: sortBy,
    orderDirection: sortDirection,
  });

  const totalPages = Math.ceil(total / pageSize);
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));

  // Handler functions
  const handleCreateProduct = async (data: CreateProductData) => {
    setIsCreating(true);
    try {
      await createProduct(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProduct = async (data: UpdateProductData) => {
    if (!editProduct) return;

    setIsUpdating(true);
    try {
      await updateProduct(editProduct.id, data);
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRestockProduct = async (data: RestockData) => {
    if (!restockProduct) return;

    setIsRestocking(true);
    try {
      await restockProductApi(
        restockProduct.id,
        data.quantityAdded,
        data.newCostPrice
      );
      setRestockProduct(null);
    } catch (error) {
      console.error("Error restocking product:", error);
    } finally {
      setIsRestocking(false);
    }
  };

  const handleDeactivateProduct = async (product: Product) => {
    try {
      await deactivateProduct(product.id);
    } catch (error) {
      console.error("Error deactivating product:", error);
    }
  };

  const handleActivateProduct = async (product: Product) => {
    try {
      await activateProduct(product.id);
    } catch (error) {
      console.error("Error activating product:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
  };

  const handleRestockClick = (product: Product) => {
    setRestockProduct(product);
  };

  // Handler untuk klik header kolom stok (hanya table/desktop)
  const handleSortStock = () => {
    setSortBy("stock");
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1); // reset ke halaman 1 saat sorting berubah
  };

  return (
    <div className="w-full h-full relative">
      <div className="sticky top-16  z-40 bg-background border-b ">
        <PageHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-1 flex-col gap-4 p-2 md:p-6">
          <div className="flex items-center justify-between gap-6">
            <SearchInput
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          {/* Sorting UI hanya di mobile, sekarang di bawah search */}
          <div className="md:hidden">
            <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold">
                  Urutkan:
                </span>
                <div className="flex-1 flex gap-2">
                  <div className="relative w-1/2">
                    <select
                      id="sortBy"
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as "productName" | "stock")
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="productName">Nama Produk</option>
                      <option value="stock">Jumlah Stok</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                  <div className="relative w-1/2">
                    <select
                      id="sortDirection"
                      value={sortDirection}
                      onChange={(e) =>
                        setSortDirection(e.target.value as "asc" | "desc")
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="asc">Naik</option>
                      <option value="desc">Turun</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="">
                <ProductTable
                  products={products}
                  loading={loading}
                  onEdit={handleEditProduct}
                  onRestock={handleRestockClick}
                  onDeactivate={handleDeactivateProduct}
                  onActivate={handleActivateProduct}
                  currentPage={page}
                  totalPages={totalPages}
                  onNextPage={handleNextPage}
                  onPrevPage={handlePrevPage}
                  onSortStock={handleSortStock}
                  sortDirectionStock={
                    sortBy === "stock" ? sortDirection : "asc"
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <ProductCards
              products={products}
              loading={loading}
              onEdit={handleEditProduct}
              onRestock={handleRestockClick}
              onDeactivate={handleDeactivateProduct}
              onActivate={handleActivateProduct}
              currentPage={page}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
            />
          </div>

          {/* Create Product Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Produk Baru</DialogTitle>
              </DialogHeader>
              <CreateProductForm
                onSubmit={handleCreateProduct}
                isLoading={isCreating}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Product Modal */}
          <Dialog
            open={!!editProduct}
            onOpenChange={() => setEditProduct(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Produk</DialogTitle>
              </DialogHeader>
              {editProduct && (
                <UpdateProductForm
                  product={editProduct}
                  onSubmit={handleUpdateProduct}
                  isLoading={isUpdating}
                  onClose={() => setEditProduct(null)}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Restock Modal */}
          <Dialog
            open={!!restockProduct}
            onOpenChange={() => setRestockProduct(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restock Produk</DialogTitle>
              </DialogHeader>
              {restockProduct && (
                <RestockForm
                  product={restockProduct}
                  onSubmit={handleRestockProduct}
                  isLoading={isRestocking}
                  onClose={() => setRestockProduct(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
