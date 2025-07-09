import { ProductCard } from "./card-product";
import { ProductSkeleton } from "./product-skeleton";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({
  products,
  loading,
  onAddToCart,
}: ProductGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
