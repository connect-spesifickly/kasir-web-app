"use client";

import * as React from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/api/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/axios";
import type { Product } from "@/lib/types";
import { useRef } from "react";

export interface AsyncSearchableDropdownOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

interface AsyncSearchableDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AsyncSearchableDropdown({
  value,
  onValueChange,
  placeholder = "Pilih produk...",
  searchPlaceholder = "Cari nama produk...",
  disabled = false,
  className,
}: AsyncSearchableDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [options, setOptions] = React.useState<AsyncSearchableDropdownOption[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<
    AsyncSearchableDropdownOption | undefined
  >(undefined);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch produk dari backend setiap kali searchTerm berubah
  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      Promise.resolve(
        api.get("/products", {
          params: { search: searchTerm, take: 12 },
        })
      )
        .then((res) => {
          console.log("[AsyncDropdown] API response:", res.data);
          const data = Array.isArray(
            (res.data as { data: { data: Product[] } }).data?.data
          )
            ? (res.data as { data: { data: Product[] } }).data.data
            : [];
          setOptions(
            data.map((product: Product) => ({
              value: product.id,
              label: product.productName,
              description: `Kode: ${product.productCode}`,
              badge: `Stok: ${product.stock}`,
            }))
          );
        })
        .catch(() => {
          setError("Gagal mengambil produk. Coba lagi.");
          setOptions([]);
        })
        .finally(() => setLoading(false));
    }, 300);
    // Cleanup
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchTerm, open]);

  // Fetch detail produk jika value berubah (untuk label selected)
  React.useEffect(() => {
    if (!value) {
      setSelectedOption(undefined);
      return;
    }
    const found = options.find((opt) => opt.value === value);
    if (found) {
      setSelectedOption(found);
      return;
    }
    setLoading(true);
    Promise.resolve(api.get(`/products/${value}`))
      .then((res) => {
        const p = (res.data as { data: Product }).data;
        setSelectedOption({
          value: p.id,
          label: p.productName,
          description: `Kode: ${p.productCode}`,
          badge: `Stok: ${p.stock}`,
        });
      })
      .finally(() => setLoading(false));
  }, [value]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
    setSearchTerm("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setSearchTerm("");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between !bg-white text-black",
            !selectedOption && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? (
            <div className="flex items-center justify-between w-full">
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <Badge variant="outline" className="ml-2 shrink-0">
                  {selectedOption.badge}
                </Badge>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-[10px] h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  setSearchTerm("");
                }
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                }
              }}
              onFocus={(e) => {
                e.target.focus();
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (open) {
                    inputRef.current?.focus();
                  }
                }, 0);
              }}
            />
          </div>
        </div>
        <div className="max-h-[160px] overflow-y-auto">
          {loading ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              Memuat...
            </div>
          ) : error ? (
            <div className="p-2 text-sm text-red-500 text-center">{error}</div>
          ) : options.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              Tidak ada hasil ditemukan.
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect(option.value)}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-[14px]">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </div>
                {option.badge && (
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {option.badge}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
