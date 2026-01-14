import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Sparkles, Tag, Info } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useShopifyProduct, PRODUCT_HANDLES } from "@/hooks/useShopifyProduct";
import { ScrollArea } from "@/components/ui/scroll-area";

// Shopify checkout subdomain (TLS is now Connected)
const PREFERRED_CHECKOUT_DOMAIN = "shop.agatsaone.com";

// Product handle to route mapping
const PRODUCT_ROUTES: Record<string, string> = {
  [PRODUCT_HANDLES.sanketlife]: "/products/sanketlife",
  [PRODUCT_HANDLES.sanketlifeProPlus]: "/products/sanketlife",
  [PRODUCT_HANDLES.zlu]: "/products/zlu",
  [PRODUCT_HANDLES.corebalance]: "/products/corebalance",
  [PRODUCT_HANDLES.easytouchRhythm]: "/products/easytouch-rhythm",
};

// Detailed product info for cross-sell
const PRODUCT_DETAILS: Record<string, { brief: string; highlights: string[]; badge?: string }> = {
  "sanket": {
    brief: "Portable 12-lead ECG device",
    highlights: ["Medical-grade accuracy", "Instant PDF reports", "No wires or gels"],
    badge: "Best Seller",
  },
  "zlu": {
    brief: "Drug-free sleep aid device",
    highlights: ["Fall asleep in 20 mins", "No side effects", "Clinically tested"],
    badge: "New",
  },
  "corebalance": {
    brief: "Smart body composition scale",
    highlights: ["10+ body metrics", "Track muscle & fat", "App connected"],
  },
  "easytouch": {
    brief: "5-rhythm health tracker",
    highlights: ["Daily rhythm score", "Energy pattern insights", "24/7 monitoring"],
  },
  "rhythm": {
    brief: "5-rhythm health tracker",
    highlights: ["Daily rhythm score", "Energy pattern insights", "24/7 monitoring"],
  },
};

const getProductDetails = (title: string): { brief: string; highlights: string[]; badge?: string } => {
  const lowerTitle = title.toLowerCase();
  for (const [key, details] of Object.entries(PRODUCT_DETAILS)) {
    if (lowerTitle.includes(key)) return details;
  }
  return { brief: "Premium health device", highlights: ["Award-winning technology", "Easy to use"] };
};

const getProductBrief = (title: string): string => {
  return getProductDetails(title).brief;
};

const getProductRoute = (handle: string): string => {
  return PRODUCT_ROUTES[handle] || "/products";
};

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { products, addToCart } = useShopifyProduct();

  const {
    items,
    isLoading,
    updateQuantity,
    removeItem,
    createCheckout,
    clearCart,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Count unique products in cart
  const uniqueProductCount = items.length;
  const hasMultipleProducts = uniqueProductCount >= 2;
  const discountRate = hasMultipleProducts ? 0.10 : 0;
  
  // Calculate prices with discount
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );
  const discountAmount = subtotal * discountRate;
  const totalPrice = subtotal - discountAmount;

  // Get recommended products (products not in cart)
  const cartVariantIds = items.map(item => item.variantId);
  const recommendedProducts = products
    .filter(product => {
      const variantId = product.node.variants.edges[0]?.node.id;
      return !cartVariantIds.includes(variantId);
    })
    .slice(0, 3);

  const handleCheckout = async () => {
    try {
      const url = await createCheckout();

      if (!url) {
        toast.error("Failed to create checkout. Please try again.");
        return;
      }

      const base = new URL(url);
      base.protocol = "https:";
      base.searchParams.set("channel", "online_store");

      const safeUrl = new URL(base.toString());
      safeUrl.host = SHOPIFY_STORE_PERMANENT_DOMAIN;

      const preferredUrl = new URL(base.toString());
      preferredUrl.host = PREFERRED_CHECKOUT_DOMAIN;

      const checkoutUrl = safeUrl.toString();

      clearCart();
      setIsOpen(false);

      if (isMobile) {
        window.location.href = checkoutUrl;
      } else {
        const opened = window.open(checkoutUrl, "_blank", "noopener,noreferrer");
        if (!opened) window.location.href = checkoutUrl;
      }

      toast.message("Opening Shopify checkout", {
        description: "Using the reliable myshopify.com domain.",
        action: {
          label: "Try shop.agatsaone.com",
          onClick: () => {
            const target = preferredUrl.toString();
            if (isMobile) window.location.href = target;
            else window.open(target, "_blank", "noopener,noreferrer");
          },
        },
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  const formatPrice = (amount: string | number, currencyCode: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const handleAddRecommended = (product: typeof products[0]) => {
    addToCart(product, 1);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0">
          <SheetHeader className="flex-shrink-0 p-6 pb-0">
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>
              {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col flex-1 min-h-0">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col p-6">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground mt-2">Add some products to get started</p>
                  </div>
                </div>

                {/* Cross-sell for empty cart */}
                {recommendedProducts.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-sm">Products You Might Like</h3>
                    </div>
                    <div className="space-y-3">
                      {recommendedProducts.map((product) => {
                        const variant = product.node.variants.edges[0]?.node;
                        const image = product.node.images?.edges?.[0]?.node;
                        return (
                          <div key={product.node.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-12 h-12 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                              {image && (
                                <img
                                  src={image.url}
                                  alt={product.node.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-xs truncate">{product.node.title}</h4>
                              {variant && (
                                <p className="text-xs font-semibold text-primary">
                                  {formatPrice(variant.price.amount, variant.price.currencyCode)}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-shrink-0 h-8 text-xs"
                              onClick={() => handleAddRecommended(product)}
                            >
                              Add
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Multi-product discount banner */}
                {!hasMultipleProducts && uniqueProductCount === 1 && (
                  <div className="mx-6 mt-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          Add 1 more product & save 10%!
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Buy 2+ products and get 10% off your entire order
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {hasMultipleProducts && (
                  <div className="mx-6 mt-4 p-3 bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        🎉 10% Multi-Product Discount Applied! You save {formatPrice(discountAmount, items[0]?.price.currencyCode || 'INR')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Scrollable items area */}
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 py-4">
                    {items.map((item) => {
                      const itemTotal = parseFloat(item.price.amount) * item.quantity;
                      const itemDiscount = hasMultipleProducts ? itemTotal * 0.10 : 0;
                      const itemFinalPrice = itemTotal - itemDiscount;
                      
                      return (
                        <div key={item.variantId} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                              {item.product.node.images?.edges?.[0]?.node && (
                                <img
                                  src={item.product.node.images.edges[0].node.url}
                                  alt={item.product.node.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{item.product.node.title}</h4>
                              {item.variantTitle !== "Default Title" && (
                                <p className="text-xs text-muted-foreground">
                                  {item.variantTitle}
                                </p>
                              )}
                              {/* Brief product description */}
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {getProductBrief(item.product.node.title)}
                              </p>
                              
                              {/* Price with discount */}
                              <div className="flex items-center gap-2 mt-1">
                                {hasMultipleProducts ? (
                                  <>
                                    <span className="text-xs text-muted-foreground line-through">
                                      {formatPrice(itemTotal, item.price.currencyCode)}
                                    </span>
                                    <span className="font-semibold text-sm text-green-600">
                                      {formatPrice(itemFinalPrice, item.price.currencyCode)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-semibold text-sm">
                                    {formatPrice(itemTotal, item.price.currencyCode)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => removeItem(item.variantId)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Learn More button */}
                          <Link 
                            to={getProductRoute(item.product.node.handle)}
                            onClick={() => setIsOpen(false)}
                            className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Info className="h-3 w-3" />
                            Learn more about this product
                          </Link>
                        </div>
                      );
                    })}

                    {/* Cross-sell section */}
                    {recommendedProducts.length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-sm">You Might Also Like</h3>
                        </div>
                        {!hasMultipleProducts && (
                          <p className="text-xs text-muted-foreground mb-3">
                            Add another product and get 10% off your entire order!
                          </p>
                        )}
                        <div className="space-y-3">
                          {recommendedProducts.map((product) => {
                            const variant = product.node.variants.edges[0]?.node;
                            const image = product.node.images?.edges?.[0]?.node;
                            const price = variant ? parseFloat(variant.price.amount) : 0;
                            const discountedPrice = price * 0.90;
                            const details = getProductDetails(product.node.title);
                            
                            return (
                              <div key={product.node.id} className="p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
                                {/* Badge */}
                                {details.badge && (
                                  <div className="mb-2">
                                    <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full uppercase tracking-wide">
                                      {details.badge}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex items-start gap-3">
                                  <div className="w-14 h-14 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                                    {image && (
                                      <img
                                        src={image.url}
                                        alt={product.node.title}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm leading-tight">{product.node.title}</h4>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                      {details.brief}
                                    </p>
                                    {variant && (
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-xs text-muted-foreground line-through">
                                          {formatPrice(variant.price.amount, variant.price.currencyCode)}
                                        </span>
                                        <span className="text-sm font-bold text-green-600">
                                          {formatPrice(discountedPrice, variant.price.currencyCode)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Key highlights */}
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {details.highlights.map((highlight, idx) => (
                                    <span 
                                      key={idx}
                                      className="inline-flex items-center text-[9px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                                    >
                                      ✓ {highlight}
                                    </span>
                                  ))}
                                </div>
                                
                                {/* Action buttons */}
                                <div className="flex items-center gap-2 mt-3">
                                  <Button
                                    size="sm"
                                    className="flex-1 h-8 text-xs"
                                    onClick={() => handleAddRecommended(product)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add to Cart
                                  </Button>
                                  <Link 
                                    to={getProductRoute(product.node.handle)}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-xs px-3"
                                    >
                                      Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Fixed checkout section */}
                <div className="flex-shrink-0 space-y-3 p-6 pt-4 border-t bg-background">
                  {hasMultipleProducts && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-muted-foreground line-through">
                        {formatPrice(subtotal, items[0]?.price.currencyCode || 'INR')}
                      </span>
                    </div>
                  )}
                  {hasMultipleProducts && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600">Multi-Product Discount</span>
                      <span className="text-green-600 font-medium">
                        -{formatPrice(discountAmount, items[0]?.price.currencyCode || 'INR')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      {formatPrice(totalPrice, items[0]?.price.currencyCode || 'INR')}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full" 
                    size="lg"
                    disabled={items.length === 0 || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Checkout...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
};
