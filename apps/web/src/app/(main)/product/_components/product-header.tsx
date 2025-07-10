import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

export const PageHeader = ({
  onOpenCreateModal,
}: {
  onOpenCreateModal: () => void;
}) => (
  <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    <Separator orientation="vertical" className="mr-2 h-4 hidden lg:block" />
    <div className="flex items-center justify-between flex-1">
      <h1 className="text-2xl md:text-3xl font-bold">Manajemen Produk</h1>
      <div className="hidden md:block">
        <Button onClick={onOpenCreateModal} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>
    </div>
  </div>
);
