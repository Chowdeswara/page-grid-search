import { useState, useEffect, useCallback } from 'react';
// import apiClient from '../lib/apiClient';
import axios from 'axios'; // Added for axios error handling
import { quickOrderService } from '../api/services/quickOrderService';

interface DropdownOption {
  value: string;
  label: string;
}

interface ApiPayload {
  [key: string]: any;
}

interface UseSearchableDropdownProps {
  apiEndpoint?: string;
  method?: string;
  basePayload: ApiPayload;
  pageSize?: number;
  transformResponse?: (data: any) => DropdownOption[];
}

interface UseSearchableDropdownReturn {
  options: DropdownOption[];
  loading: boolean;
  error: string | null;
  searchOptions: (query: string) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useSearchableDropdown({
  apiEndpoint = 'https://c5x9m1w2-3001.inc1.devtunnels.ms/coreapiops/v1/common/combo',
  method = 'POST',
  basePayload,
  pageSize = 50,
  transformResponse
}: UseSearchableDropdownProps): UseSearchableDropdownReturn {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageOffset, setPageOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState('');

  const defaultTransform = (data: any): DropdownOption[] => {
    const responseData = JSON.parse(data.ResponseData || '[]');
    return responseData.map((item: any) => ({
      value: item.id || item.value || item.code,
      label: item.name || item.label || item.description || `${item.code} || ${item.name}`
    })) || [];
  };

  const fetchOptions = useCallback(async (offset: number, query: string = '', reset: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const additionalFilters = [
        ...(basePayload?.AdditionalFilter || []),
        { FilterName: "PageNumber", FilterValue: Math.floor(offset / pageSize) + 1 },
        { FilterName: "PageSize", FilterValue: pageSize },
        ...(query ? [{ FilterName: "SearchTerm", FilterValue: query }] : []),
      ];

      const params = {
        messageType: basePayload?.messageType || "Supplier Init",
        searchTerm: query,
        page: Math.floor(offset / pageSize) + 1,
        pageSize: pageSize,
      };

      const response = await quickOrderService.getMasterCommonData(params);

      const data = response.data; // quickOrderService.getMasterCommonData already returns parsed data
      const newOptions = transformResponse ? transformResponse(data) : defaultTransform(data);

      if (reset) {
        setOptions(newOptions);
      } else {
        setOptions(prev => [...prev, ...newOptions]);
      }

      setHasMore(newOptions.length === pageSize);
      setPageOffset(offset + pageSize);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch options');
      // Axios errors have a 'response' object with status and data
      if (axios.isAxiosError(err) && err.response) {
        setError(`HTTP error! status: ${err.response.status} - ${err.response.data?.message || err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch options');
      }
      console.error('Error fetching dropdown options:', err);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, method, basePayload, pageSize, transformResponse]);

  const searchOptions = useCallback((query: string) => {
    setCurrentQuery(query);
    setPageOffset(0);
    fetchOptions(0, query, true);
  }, [fetchOptions]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchOptions(pageOffset, currentQuery, false);
  }, [hasMore, loading, pageOffset, currentQuery, fetchOptions]);

  useEffect(() => {
    fetchOptions(0, '', true);
  }, [fetchOptions]);

  return {
    options,
    loading,
    error,
    searchOptions,
    loadMore,
    hasMore
  };
}