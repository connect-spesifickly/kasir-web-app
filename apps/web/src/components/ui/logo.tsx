import { ShoppingCart } from "lucide-react";
import * as React from "react";

export function Logo({ className }: React.ComponentProps<"input">) {
  return (
    <div className="flex gap-2 items-center h-full sm:gap-16">
      <h2
        className={`font-semibold text-blue-900 ${className} text-[22px] w-fit flex items-center justify-center gap-2`}
      >
        <ShoppingCart />
        POS System
      </h2>
    </div>
  );
}
