import { useState } from "react";
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
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useShopifyProduct } from "@/hooks/useShopifyProduct";
import { ScrollArea } from "@/components/ui/scroll-area";

// Shopify checkout subdomain (TLS is now Connected)
const PREFERRED_CHECKOUT_DOMAIN = "shop.agatsaone.com";

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
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );

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

      // NOTE: If the custom domain is still intermittently blocked/refuses connection,
      // the *.myshopify.com checkout is the most reliable.
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

      // On mobile, navigate directly (popups are blocked after async calls)
      // On desktop, open in new tab for better UX
      if (isMobile) {
        window.location.href = checkoutUrl;
      } else {
        const opened = window.open(checkoutUrl, "_blank", "noopener,noreferrer");
        if (!opened) window.location.href = checkoutUrl;
      }

      toast.message("Opening Shopify checkout", {
        description: "Using the reliable myshopify.com domain. If your custom domain is working, you can try it.",
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

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
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
                {/* Scrollable items area */}
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 py-4">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
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
                          <p className="font-semibold text-sm mt-1">
                            {formatPrice(item.price.amount, item.price.currencyCode)}
                          </p>
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
                    ))}

                    {/* Cross-sell section */}
                    {recommendedProducts.length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-sm">You Might Also Like</h3>
                        </div>
                        <div className="space-y-3">
                          {recommendedProducts.map((product) => {
                            const variant = product.node.variants.edges[0]?.node;
                            const image = product.node.images?.edges?.[0]?.node;
                            return (
                              <div key={product.node.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
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
                </ScrollArea>
                
                {/* Fixed checkout section */}
                <div className="flex-shrink-0 space-y-4 p-6 pt-4 border-t bg-background">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      {formatPrice(totalPrice.toString(), items[0]?.price.currencyCode || 'INR')}
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
