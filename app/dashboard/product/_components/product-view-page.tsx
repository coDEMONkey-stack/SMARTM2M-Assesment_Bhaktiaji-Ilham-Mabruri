import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import { fetchProductById } from '@/constants/mock-api';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  
  let pageTitle = 'Create New Product';
  let product = null;

  if (productId !== 'new') {
    try {
      const { success, product: fetchedProduct, message } = await fetchProductById(Number(productId));
      
      if (!success || !fetchedProduct) {
        console.error(message); // eslint-disable-line no-console
        notFound();
      }
      
      product = fetchedProduct;
      pageTitle = `Edit Product`;
    } catch (error) {
      console.error('Error fetching product:', error); // eslint-disable-line no-console
      notFound();
    }
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
