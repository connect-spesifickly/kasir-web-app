import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchInput = ({
  searchTerm,
  onSearchChange,
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) => (
  <div className="relative max-w-md">
    <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Cari produk..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="pl-10"
    />
  </div>
);
