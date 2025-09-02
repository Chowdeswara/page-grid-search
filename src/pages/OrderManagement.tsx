import { useState, useEffect, useCallback } from "react";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { SmartGrid } from "@/components/SmartGrid";
import { Button } from "@/components/ui/button";
import { Package, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data and API functions
const generateMockData = (page: number, pageSize: number) => {
  const data = [];
  const start = (page - 1) * pageSize;
  
  for (let i = start; i < start + pageSize; i++) {
    data.push({
      id: `${109 + i}/BUY`,
      quickOrderNo: `${109 + i}/BUY`,
      quickOrderDate: "16-Jun-2022",
      status: i % 4 === 0 ? "Save" : "Fresh",
      customerSupplier: "",
      contract: `CON${String(116 + (i % 10)).padStart(9, '0')}`,
      customerSupplierRefNo: "",
      orderType: "BUY",
      totalNet: "€284,52"
    });
  }
  
  return data;
};

const mockApiCall = (filters: any, page: number, pageSize: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalCount = 157; // Mock total
      const data = generateMockData(page, pageSize);
      const hasNextPage = page * pageSize < totalCount;
      
      resolve({
        data,
        totalCount,
        hasNextPage,
        currentPage: page
      });
    }, 800); // Simulate API delay
  });
};

export default function OrderManagement() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchFilters, setSearchFilters] = useState<Record<string, string>>({});
  const [searchValue, setSearchValue] = useState("");
  
  const { toast } = useToast();
  const pageSize = 50;

  // Grid columns configuration
  const columns = [
    {
      key: "quickOrderNo",
      header: "Quick Order No.",
      render: (value: string) => (
        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary-hover">
          {value}
        </Button>
      )
    },
    { key: "quickOrderDate", header: "Quick Order Date" },
    { key: "status", header: "Status" },
    { key: "customerSupplier", header: "Customer/Supplier" },
    { key: "contract", header: "Contract" },
    { key: "customerSupplierRefNo", header: "Customer/Supplier Ref. No." },
    { key: "orderType", header: "Order Type" },
    { key: "totalNet", header: "Total Net" }
  ];

  // Search filter options
  const searchFilterOptions = {
    orderType: [
      { value: "BUY", label: "BUY" },
      { value: "SELL", label: "SELL" }
    ],
    supplier: [
      { value: "supplier1", label: "Supplier 1" },
      { value: "supplier2", label: "Supplier 2" }
    ],
    supplierCustomerContract: [
      { value: "contract1", label: "Contract 1" },
      { value: "contract2", label: "Contract 2" }
    ],
    cluster: [
      { value: "cluster1", label: "Cluster 1" },
      { value: "cluster2", label: "Cluster 2" }
    ],
    customer: [
      { value: "customer1", label: "Customer 1" },
      { value: "customer2", label: "Customer 2" }
    ],
    departurePoint: [
      { value: "point1", label: "Point 1" },
      { value: "point2", label: "Point 2" }
    ],
    arrivalPoint: [
      { value: "arrival1", label: "Arrival 1" },
      { value: "arrival2", label: "Arrival 2" }
    ],
    service: [
      { value: "service1", label: "Service 1" },
      { value: "service2", label: "Service 2" }
    ]
  };

  // Load initial data
  const loadData = useCallback(async (page: number = 1, append: boolean = false) => {
    setLoading(true);
    try {
      const result = await mockApiCall(searchFilters, page, pageSize);
      
      if (append) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setData(result.data);
      }
      
      setTotalCount(result.totalCount);
      setHasNextPage(result.hasNextPage);
      setCurrentPage(result.currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [searchFilters, toast]);

  // Load more data for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || loading) return;
    loadData(currentPage + 1, true);
  }, [currentPage, hasNextPage, loading, loadData]);

  // Handle search
  const handleSearch = useCallback((filters: Record<string, string>) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    setData([]);
    loadData(1, false);
  }, [loadData]);

  // Handle grid search
  const handleGridSearch = useCallback((value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
    setData([]);
    loadData(1, false);
  }, [loadData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setData([]);
    loadData(1, false);
  }, [loadData]);

  // Handle create new order
  const handleCreateOrder = useCallback(() => {
    toast({
      title: "Create Order",
      description: "Opening create order dialog..."
    });
  }, [toast]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setSearchFilters({});
    setSearchValue("");
    setCurrentPage(1);
    setData([]);
    loadData(1, false);
  }, [loadData]);

  // Load initial data on mount
  useEffect(() => {
    loadData(1, false);
  }, [loadData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </div>
            <span className="text-muted-foreground">/</span>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Package className="h-4 w-4" />
              <span>Quick Order Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Advanced Search */}
        <AdvancedSearch
          searchFilters={searchFilterOptions}
          onSearch={handleSearch}
          onReset={handleResetFilters}
        />

        {/* Smart Grid */}
        <SmartGrid
          title="Quick Order"
          columns={columns}
          data={data}
          loading={loading}
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          searchValue={searchValue}
          onSearch={handleGridSearch}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          onCreateNew={handleCreateOrder}
          enableInfiniteScroll={true}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  );
}