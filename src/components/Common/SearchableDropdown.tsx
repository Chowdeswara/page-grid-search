import React, { useState, useRef, useCallback, useMemo } from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
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
  name?: string; // Make name optional as it might not always be present
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

export const SearchableDropdown = ({
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
}: SearchableDropdownProps) => {
  const [open, setOpen] = useState(false);
  const { options, loading, searchOptions, loadMore, hasMore } = useSearchableDropdown({
    apiEndpoint,
    method,
    basePayload: apiPayload,
    pageSize,
    transformResponse
  });
  const listRef = useRef<HTMLDivElement>(null);
  
  // Ensure options is always an array
  const safeOptions:any = useMemo(() => Array.isArray(options) ? options : [], [options]);

  // Add "All" option if needed
  const allOptions = useMemo(() => {
    const transformedOptions = safeOptions.map(option => ({
      value: option.value,
      label: option.label,
      name: option?.name || option.label // Ensure name is always present for CommandItem value
    }));
    return includeAllOption 
      ? [{ value: "all", label: allOptionLabel, name: "all" }, ...transformedOptions]
      : transformedOptions;
  }, [safeOptions, includeAllOption, allOptionLabel]);

  const selectedOption = allOptions.find(option => option.value === value);

  const handleSearch = (query: string) => {
    searchOptions(query || '');
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
    
    if (isNearBottom && hasMore && !loading) {
      loadMore();
    }
  };

  const handleClearSelection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
    searchOptions('');
    setOpen(false);
  }, [onValueChange, searchOptions]);

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
          <div className="flex items-center space-x-1">
            {value && (
              <X
                className="h-3 w-3 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={handleClearSelection}
              />
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-background border z-50" align="start">
        <Command className="bg-background">
          <CommandInput 
            placeholder="Search options..." 
            onValueChange={handleSearch}
            className="bg-background"
          />
          <CommandList 
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto bg-background"
          >
            <CommandEmpty>
              {loading && !options.length ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading options...</span>
                </div>
              ) : (
                "No option found."
              )}
            </CommandEmpty>
            <CommandGroup className="bg-background">
              {allOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="bg-background hover:bg-accent cursor-pointer"
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
              {loading && hasMore && (
                <div className="flex items-center justify-center py-2">
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
