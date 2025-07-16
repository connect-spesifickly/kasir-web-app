"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "./_components/product-grid";
import { DesktopCart } from "./_components/card-desktop";
import { MobileCartModal } from "./_components/mobile-cart-modal";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { PageHeader } from "./_components/sale-header";
import { toast } from "sonner";
import { api } from "@/utils/axios";
import { useSession } from "next-auth/react";
import { IoIosWarning } from "react-icons/io";
import { useCategories } from "@/hooks/use-products";
// Tambahkan type untuk produk low stock
interface ProductLowStock {
  id: string;
  productName: string;
  productCode: string;
  stock: number;
  minStock: number;
}

export default function KasirPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const { data: session, status } = useSession();
  const { products, loading, refetch } = useProducts({
    search: searchTerm,
    isActive: true,
    stockGreaterThan: 0,
    categoryId: selectedCategory || undefined,
  });
  const { categories, loading: loadingCategories } = useCategories();
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    processPayment,
    isProcessing,
  } = useCart();
  // Handler functions
  const handlePayment = async () => {
    const sale = await processPayment();
    if (sale) {
      setIsPaymentOpen(false);
      refetch(); // update produk setelah transaksi
    }
  };

  const handleOpenMobileCart = () => {
    setIsPaymentOpen(true);
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  React.useEffect(() => {
    // Fetch low stock products saat dashboard dibuka
    const fetchLowStock = async () => {
      console.log("mulai fetch");
      try {
        const res = await api.get("/products/low-stock", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        const products = Array.isArray(
          (res.data as { data?: ProductLowStock[] })?.data
        )
          ? (res.data as { data: ProductLowStock[] }).data
          : [];
        if (products.length > 0) {
          toast.warning(
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Stok menipis:
              </div>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {products.map((p: ProductLowStock) => (
                  <li key={p.productName}>
                    {p.productName} (sisa: {p.stock})
                  </li>
                ))}
              </ul>
            </div>,
            {
              icon: (
                <span style={{ color: "#dc3545" }}>
                  {" "}
                  <IoIosWarning size={20} className="" />
                </span>
              ),
              style: {
                background: "#ffc107",
                color: "#212529",
                border: "1px solid #ffc107",
              },
            }
          );
        }
      } catch {
        console.error("Error fetching low stock products");
      }
    };
    if (status == "loading") return undefined;
    fetchLowStock();
  }, [session, status]);

  return (
    <div className="w-full h-full relative">
      <div className="sticky top-16  z-40 bg-background border-b ">
        <PageHeader
          totalItems={totalItems}
          onOpenMobileCart={handleOpenMobileCart}
        />
      </div>
      <div className="flex flex-col w-full ">
        <div className="flex flex-1 flex-col gap-4 p-2 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="md:col-span-2 space-y-4">
              <div className="relative flex items-center gap-2">
                <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama produk atau kode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {/* Dropdown kategori */}
                <div className="relative w-full md:w-auto min-w-[160px] flex-1">
                  <select
                    id="categoryFilter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-primary border-gray-200"
                    disabled={loadingCategories}
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ProductGrid
                products={products}
                loading={loading}
                onAddToCart={addToCart}
              />
            </div>

            {/* Desktop Cart */}
            <DesktopCart
              cart={cart}
              totalItems={totalItems}
              totalPrice={totalPrice}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              onPayment={handlePayment}
              isProcessing={isProcessing}
            />
          </div>

          {/* Mobile Cart Modal */}
          <MobileCartModal
            isOpen={isPaymentOpen}
            onOpenChange={setIsPaymentOpen}
            cart={cart}
            totalItems={totalItems}
            totalPrice={totalPrice}
            onUpdateQuantity={updateQuantity}
            onPayment={handlePayment}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
