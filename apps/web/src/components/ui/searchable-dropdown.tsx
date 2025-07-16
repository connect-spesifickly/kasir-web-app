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

export interface SearchableDropdownOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

interface SearchableDropdownProps {
  options: SearchableDropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableDropdown({
  options,
  value,
  onValueChange,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari...",
  disabled = false,
  className,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
    setSearchTerm("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Focus on input when dropdown opens
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
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  setSearchTerm("");
                }
                // Prevent default behavior for arrow keys to keep focus on input
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                }
              }}
              onFocus={(e) => {
                // Keep focus on input when dropdown opens
                e.target.focus();
              }}
              onBlur={() => {
                // Keep focus on input when typing
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
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground text-center">
              Tidak ada hasil ditemukan.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect(option.value)}
                onMouseDown={(e) => {
                  // Prevent focus from moving to the menu item
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
