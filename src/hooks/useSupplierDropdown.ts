import { useState, useEffect, useCallback } from 'react';

interface SupplierOption {
  value: string;
  label: string;
}

interface UseSupplierDropdownReturn {
  suppliers: SupplierOption[];
  loading: boolean;
  error: string | null;
  searchSuppliers: (query: string) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useSupplierDropdown(): UseSupplierDropdownReturn {
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageOffset, setPageOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState('');

  const fetchSuppliers = useCallback(async (offset: number, query: string = '', reset: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://c5x9m1w2-3001.inc1.devtunnels.ms/coreapiops/v1/common/combo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSize: 50,
          pageOffset: offset,
          searchQuery: query
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to match our SupplierOption interface
      const newSuppliers = data.items?.map((item: any) => ({
        value: item.id || item.value || item.code,
        label: item.name || item.label || item.description
      })) || [];

      if (reset) {
        setSuppliers(newSuppliers);
      } else {
        setSuppliers(prev => [...prev, ...newSuppliers]);
      }

      // Check if there are more items to load
      setHasMore(newSuppliers.length === 50);
      setPageOffset(offset + 50);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSuppliers = useCallback((query: string) => {
    setCurrentQuery(query);
    setPageOffset(0);
    fetchSuppliers(0, query, true);
  }, [fetchSuppliers]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchSuppliers(pageOffset, currentQuery, false);
  }, [hasMore, loading, pageOffset, currentQuery, fetchSuppliers]);

  // Load initial data
  useEffect(() => {
    fetchSuppliers(0, '', true);
  }, [fetchSuppliers]);

  return {
    suppliers,
    loading,
    error,
    searchSuppliers,
    loadMore,
    hasMore
  };
}