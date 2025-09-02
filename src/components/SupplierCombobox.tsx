import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSupplierDropdown } from "@/hooks/useSupplierDropdown";

interface SupplierComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SupplierCombobox({
  value,
  onValueChange,
  placeholder = "Select supplier...",
  className
}: SupplierComboboxProps) {
  const [open, setOpen] = useState(false);
  const { suppliers, loading, searchSuppliers, loadMore, hasMore } = useSupplierDropdown();
  const listRef = useRef<HTMLDivElement>(null);
  
  // Add "All" option to the beginning
  const allSuppliers = [{ value: "all", label: "All" }, ...suppliers];

  const selectedSupplier = allSuppliers.find(supplier => supplier.value === value);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchSuppliers(query);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
    
    if (isNearBottom && hasMore && !loading) {
      loadMore();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between bg-background", className)}
        >
          {selectedSupplier?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-popover border-border" align="start">
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Search suppliers..." 
            onValueChange={handleSearch}
            className="bg-transparent"
          />
          <CommandList 
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto bg-transparent"
          >
            <CommandEmpty>No supplier found.</CommandEmpty>
            <CommandGroup className="bg-transparent">
              {allSuppliers.map((supplier) => (
                <CommandItem
                  key={supplier.value}
                  value={supplier.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="bg-transparent hover:bg-accent"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === supplier.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {supplier.label}
                </CommandItem>
              ))}
              {loading && (
                <div className="flex items-center justify-center py-2 bg-transparent">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading more...</span>
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}