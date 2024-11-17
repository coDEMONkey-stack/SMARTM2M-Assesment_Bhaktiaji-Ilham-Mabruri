'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useProductTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [categoriesFilter, setCategoriesFilter] = useQueryState(
    'categories',
    searchParams.categories.withOptions({ shallow: false }).withDefault('')
  );

  const setFilterValue = useCallback(
    (filterKey: string, value: string | string[] | null) => {
      if (filterKey === 'categories') {
        const formattedValue = Array.isArray(value)
          ? value.join(',')
          : value || '';
        setCategoriesFilter(formattedValue);
      }
      // Tambahkan logika untuk filter lain jika diperlukan
    },
    [setCategoriesFilter]
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setCategoriesFilter(null);
    setPage(1);
  }, [setSearchQuery, setCategoriesFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoriesFilter;
  }, [searchQuery, categoriesFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    categoriesFilter,
    setFilterValue,
    setCategoriesFilter
  };
}
