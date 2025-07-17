import { ProductCard } from "./card-product";
import { ProductSkeleton } from "./product-skeleton";
import type { Product } from "@/lib/types";
import * as React from "react";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingMore: boolean;
}

export const ProductGrid = ({
  products,
  loading,
  onAddToCart,
  hasMore,
  onLoadMore,
  loadingMore,
}: ProductGridProps) => {
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore, onLoadMore]);

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">Product not found</p>
          </div>
        )}
      </div>

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-4">
          {loadingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProductSkeleton key={`loading-${i}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* End of Results */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Semua produk telah dimuat ({products.length} produk)
          </p>
        </div>
      )}
    </div>
  );
};
