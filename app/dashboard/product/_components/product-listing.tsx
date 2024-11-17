import { Product } from '@/constants/data';
import { fetchFilterProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('q') || '';
  const pageLimit = searchParamsCache.get('limit') || 10;
  
  let categories: string[] = [];
  
  const rawCategories = searchParamsCache.get('categories');
  
  if (typeof rawCategories === 'string' && rawCategories !== '') {
    categories = rawCategories.split(','); 
  } else if (Array.isArray(rawCategories)) {
    categories = rawCategories;
  }

  const filters = {
    page: page || 1,
    limit: pageLimit || 10,
    ...(search && { search }),
    ...(categories.length > 0 && { category: categories.join(',') }), // Pass categories as a comma-separated string
  };

  try {
    const data = await fetchFilterProducts(filters);
    const totalProducts = data?.total || 0;
    const products: Product[] = data?.data || [];

    return (
      <ProductTable
        columns={columns}
        data={products}
        totalItems={totalProducts}
      />
    );
  } catch (error) {
    console.error('Failed to fetch products:', error); // eslint-disable-line no-console
    return <div>Error fetching products. Please try again later.</div>;
  }
}
