import { useState, useRef } from "react";
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
import { useSearchableDropdown } from "@/hooks/useSearchableDropdown";

interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  apiPayload: any;
  apiEndpoint?: string;
  method?: string;
  pageSize?: number;
  transformResponse?: (data: any) => DropdownOption[];
  includeAllOption?: boolean;
  allOptionLabel?: string;
}

export function SearchableDropdown({
  value,
  onValueChange,
  placeholder = "Select option...",
  className,
  apiPayload,
  apiEndpoint,
  method = "POST",
  pageSize = 50,
  transformResponse,
  includeAllOption = true,
  allOptionLabel = "All"
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const { options, loading, searchOptions, loadMore, hasMore } = useSearchableDropdown({
    apiEndpoint,
    method,
    basePayload: apiPayload,
    pageSize,
    transformResponse
  });
  const listRef = useRef<HTMLDivElement>(null);
  
  // Add "All" option if needed
  const allOptions = includeAllOption 
    ? [{ value: "all", label: allOptionLabel }, ...options]
    : options;

  const selectedOption = allOptions.find(option => option.value === value);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchOptions(query);
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
          {selectedOption?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-popover border-border" align="start">
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Search options..." 
            onValueChange={handleSearch}
            className="bg-transparent"
          />
          <CommandList 
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto bg-transparent"
          >
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup className="bg-transparent">
              {allOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="bg-transparent hover:bg-accent"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
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