'use client';

import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useProductTableFilters } from './use-product-table-filters';
import { useEffect, useState } from 'react';
import { mockCategories } from '@/constants/mock-api';

export default function ProductTableAction() {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useProductTableFilters();

  const [categoriesOptions, setCategoriesOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = mockCategories;
        setCategoriesOptions(
          categories.map((category: string) => ({
            label: category,
            value: category,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch categories:', error); // eslint-disable-line no-console
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey="categories"
        title="Categories"
        options={categoriesOptions}
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
        setPage={setPage}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
