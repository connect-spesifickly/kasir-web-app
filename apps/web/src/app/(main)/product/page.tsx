"use client";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-products";
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
  const [sortBy, setSortBy] = React.useState<
    "productName" | "stock" | "createdAt"
  >("stock");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
  // Tambahkan state khusus untuk tanggal
  const [sortDirectionDate, setSortDirectionDate] = React.useState<
    "asc" | "desc"
  >("desc");
  const [categoryId, setCategoryId] = React.useState<string>("all");
  const [isActive, setIsActive] = React.useState<string>("all");
  const { categories } = useCategories();

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
    categoryId: categoryId === "all" ? undefined : categoryId,
    isActive: isActive === "all" ? undefined : isActive === "true",
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
    if (sortBy === "stock") {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy("stock");
      setSortDirection("asc"); // default direction untuk stock
    }
    setPage(1);
  };

  // Handler untuk klik header kolom tanggal
  const handleSortDate = () => {
    if (sortBy === "createdAt") {
      setSortDirectionDate((prev) => (prev === "asc" ? "desc" : "asc"));
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy("createdAt");
      setSortDirection("desc"); // default direction untuk tanggal
      setSortDirectionDate("desc");
    }
    setPage(1);
  };

  // Handler untuk klik header kolom nama produk
  const handleSortName = () => {
    if (sortBy === "productName") {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy("productName");
      setSortDirection("asc"); // default direction untuk nama
    }
    setPage(1);
  };

  return (
    <div className="w-full h-full relative">
      <div className="sticky top-16  z-40 bg-background border-b ">
        <PageHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-1 flex-col gap-4 p-2 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row md:items-center w-full gap-2">
              <SearchInput
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              {/* Baris filter kategori & status */}
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                {/* Filter Kategori */}
                <div className="relative w-full md:w-auto min-w-[160px] flex-1">
                  <select
                    id="categoryFilter"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-primary border-gray-200"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Filter Status Aktif/Nonaktif */}
                <div className="relative w-full md:w-auto min-w-[140px] flex-1">
                  <select
                    id="statusFilter"
                    value={isActive}
                    onChange={(e) => setIsActive(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-primary border-gray-200"
                  >
                    <option value="all">Semua Status</option>
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Filter & Sorting UI klasik untuk mobile */}
          <div className="md:hidden">
            <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-2 border border-gray-200">
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
                        setSortBy(
                          e.target.value as
                            | "productName"
                            | "stock"
                            | "createdAt"
                        )
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-primary border-gray-200"
                    >
                      <option value="createdAt">Tanggal</option>
                      <option value="productName">Nama Produk</option>
                      <option value="stock">Jumlah Stok</option>
                    </select>
                  </div>
                  <div className="relative w-1/2">
                    <select
                      id="sortDirection"
                      value={sortDirection}
                      onChange={(e) =>
                        setSortDirection(e.target.value as "asc" | "desc")
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-primary border-gray-200"
                    >
                      <option value="asc">Naik</option>
                      <option value="desc">Turun</option>
                    </select>
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
                  onSortDate={handleSortDate}
                  sortDirectionDate={sortDirectionDate}
                  onSortName={handleSortName}
                  sortDirectionName={
                    sortBy === "productName" ? sortDirection : "asc"
                  }
                  sortBy={sortBy}
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
