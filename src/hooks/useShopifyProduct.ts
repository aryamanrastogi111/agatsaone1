import { useState, useEffect } from 'react';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

export function useShopifyProduct(productHandle?: string | 'skip') {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(productHandle !== 'skip');
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (productHandle === 'skip') return;
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts(50);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [productHandle]);

  const findProductByHandle = (handle: string): ShopifyProduct | undefined => {
    return products.find(p => p.node.handle === handle);
  };

  const findProductByTitle = (title: string): ShopifyProduct | undefined => {
    return products.find(p =>
      p.node.title.toLowerCase().includes(title.toLowerCase())
    );
  };

  const addToCart = (product: ShopifyProduct, quantity: number = 1) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) {
      toast.error('Product variant not found');
      return;
    }

    addItem({
      productId: product.node.id,
      productName: product.node.title,
      variantTitle: variant.title,
      price: parseFloat(variant.price.amount),
      quantity,
      imageUrl: product.node.images?.edges?.[0]?.node?.url,
    });

    toast.success(`${product.node.title} added to cart`, {
      position: 'top-center',
    });
  };

  return {
    products,
    loading,
    error,
    findProductByHandle,
    findProductByTitle,
    addToCart,
  };
}

// Product handle mappings
export const PRODUCT_HANDLES = {
  sanketlife: 'sanket-life-2-0-portable-ecg-machine-12-lead-ecg-device',
  sanketlifeProPlus: 'sanketlife-pro',
  zlu: 'the-zlu-sleep-aid-device-restful-sleep-without-medicine',
  corebalance: 'corebalance',
  easytouchRhythm: 'easytouch-rhythm',
};
