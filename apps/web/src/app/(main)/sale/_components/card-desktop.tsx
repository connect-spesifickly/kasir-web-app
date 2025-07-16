import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { CartSummary } from "./card-summary";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./card-item";
import type { Product } from "@/lib/types";

interface CartItemType {
  productId: string;
  quantity: number;
  product: Product;
}

interface DesktopCartProps {
  cart: CartItemType[];
  totalItems: number;
  totalPrice: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPayment: () => void;
  isProcessing: boolean;
}

export const DesktopCart = ({
  cart,
  totalItems,
  totalPrice,
  onUpdateQuantity,
  onRemoveFromCart,
  onPayment,
  isProcessing,
}: DesktopCartProps) => (
  <div className="hidden md:block">
    <Card className="sticky top-36">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Keranjang ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Keranjang kosong
          </p>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveFromCart={onRemoveFromCart}
                />
              ))}
            </div>
            <Separator />
            <CartSummary
              cart={cart}
              totalPrice={totalPrice}
              onPayment={onPayment}
              isProcessing={isProcessing}
            />
          </>
        )}
      </CardContent>
    </Card>
  </div>
);
