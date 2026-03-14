// Shopify Storefront API Configuration
export const SHOPIFY_API_VERSION = '2025-07';
export const SHOPIFY_STORE_PERMANENT_DOMAIN = '2nn8py-5t.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = 'a54d568ea2cc9b9565b925cfc654a314';



export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          quantityAvailable?: number;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

// Storefront API helper function
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    // Silently return null — do not show a toast to customers
    console.warn('Shopify Storefront API: 402 Payment Required. Store billing plan may need to be upgraded.');
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export async function fetchProducts(first: number = 20, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first, query });
  if (!data) return [];
  return data.data.products.edges;
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct['node'] | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data) return null;
  return data.data.product;
}

// Cart mutations
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Check if sale is active and get discount code
function getActiveDiscountCode(): string | null {
  // Republic Day Sale: active until Jan 26, 2026 midnight IST
  const saleEndDate = new Date('2026-01-26T23:59:59+05:30');
  const now = new Date();
  if (now <= saleEndDate) {
    return 'REPUBLIC10';
  }
  return null;
}

// Check if cart has eligible products for the discount
function hasEligibleProducts(items: CartItem[]): boolean {
  return items.some(item => 
    item.product.node.handle === 'easytouch-rhythm' || 
    item.product.node.title.toLowerCase().includes('easytouch rhythm')
  );
}

// CartItem is now defined in @/lib/razorpay — kept for legacy reference only
export interface ShopifyCartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export async function createStorefrontCheckout(items: CartItem[]): Promise<string> {
  try {
    const lines = items.map(item => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
    }));

    // Auto-apply discount code if sale is active and cart has eligible products
    const discountCode = getActiveDiscountCode();
    const shouldApplyDiscount = discountCode && hasEligibleProducts(items);

    const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
      input: {
        lines,
        ...(shouldApplyDiscount && { discountCodes: [discountCode] }),
      },
    });

    if (!cartData) {
      throw new Error('Failed to create cart');
    }

    if (cartData.data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    const cart = cartData.data.cartCreate.cart;

    if (!cart.checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    // Shopify can return either an absolute URL or a relative path (e.g. /cart/c/...).
    // It may also return an absolute URL on the store's primary domain (e.g. https://www.agatsaone.com/...),
    // which would 404 because www.agatsaone.com is THIS React site, not the Shopify online store.
    // We always force the URL onto the permanent *.myshopify.com domain.
    const rawCheckoutUrl: string = cart.checkoutUrl;
    const candidateUrl = /^https?:\/\//i.test(rawCheckoutUrl)
      ? rawCheckoutUrl
      : `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}${rawCheckoutUrl}`;

    const url = new URL(candidateUrl);
    url.protocol = "https:";
    url.host = SHOPIFY_STORE_PERMANENT_DOMAIN;
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch (error) {
    console.error('Error creating storefront checkout:', error);
    throw error;
  }
}
