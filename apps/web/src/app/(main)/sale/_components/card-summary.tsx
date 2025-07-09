import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/types";

interface CartItemType {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartSummaryProps {
  cart: CartItemType[];
  totalPrice: number;
  onPayment: () => void;
  isProcessing: boolean;
}

export const CartSummary = ({
  cart,
  totalPrice,
  onPayment,
  isProcessing,
}: CartSummaryProps) => (
  <div className="space-y-2">
    <div className="flex justify-between text-lg font-bold">
      <span>Total:</span>
      <span>Rp {totalPrice.toLocaleString()}</span>
    </div>

    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg" disabled={cart.length === 0}>
          BAYAR
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.product.productName} x{item.quantity}
                </span>
                <span>
                  Rp {(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <Separator />
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
              "Konfirmasi Pembayaran"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);
