import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download, 
  MoreHorizontal,
  Plus,
  Filter,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GridColumn {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface GridData {
  [key: string]: any;
}

interface SmartGridProps {
  title: string;
  columns: GridColumn[];
  data: GridData[];
  loading?: boolean;
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
  searchValue?: string;
  onPageChange?: (page: number) => void;
  onSearch?: (value: string) => void;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onCreateNew?: () => void;
  enableInfiniteScroll?: boolean;
  hasNextPage?: boolean;
  className?: string;
}

export function SmartGrid({
  title,
  columns,
  data,
  loading = false,
  totalCount = 0,
  pageSize = 50,
  currentPage = 1,
  searchValue = "",
  onPageChange,
  onSearch,
  onLoadMore,
  onRefresh,
  onCreateNew,
  enableInfiniteScroll = true,
  hasNextPage = false,
  className = ""
}: SmartGridProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll implementation
  useEffect(() => {
    if (!enableInfiniteScroll || !hasNextPage || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          setIsLoadingMore(true);
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [enableInfiniteScroll, hasNextPage, isLoadingMore, onLoadMore]);

  // Reset loading state when data changes
  useEffect(() => {
    setIsLoadingMore(false);
  }, [data]);

  const handleSearch = useCallback(() => {
    onSearch?.(localSearchValue);
  }, [localSearchValue, onSearch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      Save: { className: "bg-success text-success-foreground", label: "Save" },
      Fresh: { className: "bg-primary text-primary-foreground", label: "Fresh" },
      Pending: { className: "bg-warning text-warning-foreground", label: "Pending" },
      Cancelled: { className: "bg-destructive text-destructive-foreground", label: "Cancelled" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { className: "bg-secondary text-secondary-foreground", label: status };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <Card className={cn("bg-card border-border", className)}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {totalCount}
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 min-w-[300px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={localSearchValue}
                  onChange={(e) => setLocalSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-background"
                />
              </div>
              <Button 
                onClick={handleSearch}
                size="sm"
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {onCreateNew && (
                <Button 
                  onClick={onCreateNew}
                  size="sm"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-4 text-left text-sm font-medium text-muted-foreground",
                    column.width && `w-${column.width}`
                  )}
                >
                  {column.header}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={row.id || index} 
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm">
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.key === 'status' ? (
                      renderStatusBadge(row[column.key])
                    ) : (
                      <span className="text-foreground">{row[column.key]}</span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && data.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No data found</p>
          </div>
        )}
      </div>

      {/* Infinite scroll trigger */}
      {enableInfiniteScroll && hasNextPage && (
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          {isLoadingMore && (
            <div className="flex items-center text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Loading more...
            </div>
          )}
        </div>
      )}

      {/* Footer with pagination info */}
      <div className="px-6 py-4 border-t border-border bg-muted/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex} to {endIndex} of {totalCount} entries
          </p>
          
          {!enableInfiniteScroll && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, Math.ceil(totalCount / pageSize)))].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange?.(pageNumber)}
                      className={cn(
                        "w-8 h-8 p-0",
                        currentPage === pageNumber && "bg-primary text-primary-foreground"
                      )}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}