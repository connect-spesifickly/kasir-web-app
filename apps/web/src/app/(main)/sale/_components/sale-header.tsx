import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
interface PageHeaderProps {
  totalItems: number;
  onOpenMobileCart: () => void;
}
export const PageHeader = ({
  totalItems,
  onOpenMobileCart,
}: PageHeaderProps) => (
  <div className="flex h-16 shrink-0 items-center gap-2 border-b px-2 ">
    {/* <Separator orientation="vertical" className=" h-4 hidden lg:block" /> */}
    <div className="flex items-center justify-between flex-1">
      <h1 className="text-2xl md:text-3xl font-bold md:px-5 font-[stencil]">
        Kasir
      </h1>
      <div className="md:hidden ">
        <Button
          variant="outline"
          size="sm"
          className="relative bg-transparent text-black! h-9"
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
