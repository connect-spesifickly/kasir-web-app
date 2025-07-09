import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";

interface CartItemType {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  showDeleteButton?: boolean;
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemoveFromCart,
  showDeleteButton = true,
}: CartItemProps) => (
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div className="flex-1">
      <p className="font-medium text-sm">{item.product.productName}</p>
      <p className="text-sm text-muted-foreground">
        Rp {item.product.price.toLocaleString()}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center">{item.quantity}</span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
      >
        <Plus className="h-3 w-3" />
      </Button>
      {showDeleteButton && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onRemoveFromCart(item.productId)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  </div>
);
