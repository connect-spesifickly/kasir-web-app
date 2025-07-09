import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { CartItem } from "./card-item";
import type { Product } from "@/lib/types";

interface CartItemType {
  productId: string;
  quantity: number;
  product: Product;
}

interface MobileCartModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItemType[];
  totalItems: number;
  totalPrice: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onPayment: () => void;
  isProcessing: boolean;
}

export const MobileCartModal = ({
  isOpen,
  onOpenChange,
  cart,
  totalItems,
  totalPrice,
  onUpdateQuantity,
  onPayment,
  isProcessing,
}: MobileCartModalProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="md:hidden max-w-sm">
      <DialogHeader>
        <DialogTitle>Keranjang ({totalItems})</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Keranjang kosong
          </p>
        ) : (
          <>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveFromCart={() => {}}
                  showDeleteButton={false}
                />
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>Rp {totalPrice.toLocaleString()}</span>
              </div>
              <Button
                onClick={onPayment}
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "BAYAR"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </DialogContent>
  </Dialog>
);
