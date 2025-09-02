import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { SupplierCombobox } from "./SupplierCombobox";

interface FilterOption {
  value: string;
  label: string;
}

interface AdvancedSearchProps {
  searchFilters?: {
    orderType?: FilterOption[];
    supplier?: FilterOption[];
    supplierCustomerContract?: FilterOption[];
    cluster?: FilterOption[];
    customer?: FilterOption[];
    departurePoint?: FilterOption[];
    arrivalPoint?: FilterOption[];
    service?: FilterOption[];
  };
  onSearch?: (filters: Record<string, string>) => void;
  onReset?: () => void;
  className?: string;
}

export function AdvancedSearch({ 
  searchFilters = {}, 
  onSearch, 
  onReset,
  className = "" 
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<Record<string, string>>({
    orderType: "all",
    supplier: "all",
    supplierCustomerContract: "all",
    cluster: "all",
    customer: "all",
    customerSupplierRefNo: "",
    draftBillNo: "",
    departurePoint: "all",
    arrivalPoint: "all",
    service: "all"
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleReset = () => {
    setFilters({
      orderType: "all",
      supplier: "all",
      supplierCustomerContract: "all",
      cluster: "all",
      customer: "all",
      customerSupplierRefNo: "",
      draftBillNo: "",
      departurePoint: "all",
      arrivalPoint: "all",
      service: "all"
    });
    onReset?.();
  };

  const defaultOptions = [{ value: "all", label: "All" }];

  return (
    <Card className={`p-6 bg-card border-border ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Search</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Order Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Order Type</label>
            <Select value={filters.orderType} onValueChange={(value) => handleFilterChange("orderType", value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {[...defaultOptions, ...(searchFilters.orderType || [])].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Supplier */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Supplier</label>
            <SupplierCombobox
              value={filters.supplier}
              onValueChange={(value) => handleFilterChange("supplier", value)}
              placeholder="All"
              className="w-full"
            />
          </div>

          {/* Supplier/Customer Contract */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Supplier/Customer Contract</label>
            <Select value={filters.supplierCustomerContract} onValueChange={(value) => handleFilterChange("supplierCustomerContract", value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {[...defaultOptions, ...(searchFilters.supplierCustomerContract || [])].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cluster */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cluster</label>
            <Select value={filters.cluster} onValueChange={(value) => handleFilterChange("cluster", value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {[...defaultOptions, ...(searchFilters.cluster || [])].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Customer</label>
            <Select value={filters.customer} onValueChange={(value) => handleFilterChange("customer", value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {[...defaultOptions, ...(searchFilters.customer || [])].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer/Supplier Ref No */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Customer/Supplier Ref No</label>
            <Input
              placeholder="Filter customer/supplier ref no..."
              value={filters.customerSupplierRefNo}
              onChange={(e) => handleFilterChange("customerSupplierRefNo", e.target.value)}
              className="bg-background"
            />
          </div>

          {/* Draft Bill No */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Draft Bill No</label>
            <Input
              placeholder="Filter draft bill no..."
              value={filters.draftBillNo}
              onChange={(e) => handleFilterChange("draftBillNo", e.target.value)}
              className="bg-background"
            />
          </div>

          {/* Departure Point */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Departure Point</label>
            <Select value={filters.departurePoint} onValueChange={(value) => handleFilterChange("departurePoint", value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {[...defaultOptions, ...(searchFilters.departurePoint || [])].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Arrival Point */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Arrival Point</label>
            <Select value={filters.arrivalPoint} onValueChange={(value) => handleFilterChange("arrivalPoint", value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {[...defaultOptions, ...(searchFilters.arrivalPoint || [])].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Service</label>
            <Select value={filters.service} onValueChange={(value) => handleFilterChange("service", value)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {[...defaultOptions, ...(searchFilters.service || [])].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSearch} className="bg-primary hover:bg-primary-hover text-primary-foreground">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" onClick={handleReset} className="border-border">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}