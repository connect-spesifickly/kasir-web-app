import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ShoppingCart } from "lucide-react";

interface PageHeaderProps {
  totalItems: number;
  onOpenMobileCart: () => void;
}

export const PageHeader = ({
  totalItems,
  onOpenMobileCart,
}: PageHeaderProps) => (
  <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    <Separator orientation="vertical" className="mr-2 h-4 hidden lg:block" />
    <div className="flex items-center justify-between flex-1 ">
      <h1 className="text-2xl md:text-3xl font-bold">Kasir</h1>
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          className="relative bg-transparent text-black!"
          onClick={onOpenMobileCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Keranjang
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  </div>
);
