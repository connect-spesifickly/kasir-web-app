"use client";

import { useState } from "react";
import { saleApi } from "@/lib/api/sale";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useSession } from "next-auth/react";

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = useSession();
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast(`Stok ${product.productName} hanya tersisa ${product.stock}`);
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > product.stock) {
          toast(`Stok ${product.productName} hanya tersisa ${product.stock}`);
          return prev;
        }
        return [...prev, { productId: product.id, quantity, product }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      const item = prev.find((item) => item.productId === productId);
      if (!item) return prev;

      if (quantity > item.product.stock) {
        toast(
          `Stok ${item.product.productName} hanya tersisa ${item.product.stock}`
        );
        return prev;
      }

      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const processPayment = async () => {
    if (cart.length === 0) {
      toast("Tambahkan produk ke keranjang terlebih dahulu");
      return null;
    }
    setIsProcessing(true);
    try {
      const cartData = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const sale = await saleApi.create(cartData, session?.accessToken);

      toast(
        `Transaksi dengan Total: Rp ${getTotalPrice().toLocaleString()} berhasil dilakukan`
      );

      clearCart();

      return sale;
    } catch {
      toast("Transaksi gagal");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    processPayment,
    isProcessing,
  };
}
