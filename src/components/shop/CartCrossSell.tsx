import { Plus, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products as catalogProducts } from "@/data/products";
import { useCartStore } from "@/stores/cartStore";
import type { CartItem } from "@/lib/razorpay";
import { toast } from "sonner";

const BUNDLE_DISCOUNT_PERCENT = 15;

// Map catalog product IDs to cart productId / pricing
const PRODUCT_CART_MAP: Record<string, { productId: string; price: number; variantTitle: string; imageUrl?: string }> = {
  sanketlife: { productId: "sanketlife", price: 3999, variantTitle: "Default Title" },
  "easytouch-rhythm": { productId: "easytouch-rhythm", price: 2999, variantTitle: "Default Title" },
  zlu: { productId: "zlu", price: 4999, variantTitle: "Default Title" },
  corebalance: { productId: "corebalance", price: 1999, variantTitle: "Default Title" },
};

export function CartCrossSell() {
  const { items, addItem } = useCartStore();
  const cartProductIds = items.map((i) => i.productId);

  // Products not already in cart
  const recommendations = catalogProducts.filter(
    (p) => !cartProductIds.includes(p.id) && PRODUCT_CART_MAP[p.id]
  );

  if (recommendations.length === 0) return null;

  const handleAddBundle = (product: (typeof catalogProducts)[0]) => {
    const mapping = PRODUCT_CART_MAP[product.id];
    if (!mapping) return;

    const discountedPrice = Math.round(mapping.price * (1 - BUNDLE_DISCOUNT_PERCENT / 100));

    const cartItem: CartItem = {
      productId: mapping.productId,
      productName: product.name,
      variantTitle: mapping.variantTitle,
      price: discountedPrice,
      quantity: 1,
      imageUrl: product.image,
    };

    addItem(cartItem);
    toast.success(`${product.name} added with ${BUNDLE_DISCOUNT_PERCENT}% bundle discount!`);
  };

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="px-6 pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">Complete Your Health Kit</h4>
      </div>

      {/* Bundle discount banner */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg mb-3">
        <Tag className="h-3.5 w-3.5 text-green-600 shrink-0" />
        <span className="text-xs font-medium text-green-700 dark:text-green-400">
          Add another product & get <span className="font-bold">{BUNDLE_DISCOUNT_PERCENT}% off</span> instantly
        </span>
      </div>

      {/* Product cards */}
      <div className="space-y-2">
        {recommendations.slice(0, 3).map((product) => {
          const mapping = PRODUCT_CART_MAP[product.id];
          if (!mapping) return null;
          const originalPrice = mapping.price;
          const discountedPrice = Math.round(originalPrice * (1 - BUNDLE_DISCOUNT_PERCENT / 100));

          return (
            <div
              key={product.id}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              {/* Image */}
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-0.5"
                  loading="lazy"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground leading-tight truncate">{product.tagline}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-semibold text-primary">{formatINR(discountedPrice)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatINR(originalPrice)}</span>
                  <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-1 py-0.5 rounded">
                    -{BUNDLE_DISCOUNT_PERCENT}%
                  </span>
                </div>
              </div>

              {/* Add button */}
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 h-8 px-3 text-xs font-semibold border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleAddBundle(product)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
