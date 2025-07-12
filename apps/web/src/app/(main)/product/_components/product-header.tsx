import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const PageHeader = ({
  onOpenCreateModal,
}: {
  onOpenCreateModal: () => void;
}) => (
  <div className="flex h-16 shrink-0 items-center gap-2 border-b px-2">
    <div className="flex items-center justify-between flex-1">
      <h1 className="text-2xl md:text-3xl font-bold md:px-5 font-[stencil]">
        Manajemen Produk
      </h1>
      <div className="hidden md:block md:mr-4">
        <Button onClick={onOpenCreateModal} className="">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>
    </div>
  </div>
);
