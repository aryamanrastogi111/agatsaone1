import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildCheckoutUrl } from "@/lib/bandColors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { CartCrossSell } from "@/components/shop/CartCrossSell";

export const CartDrawer = ({
  externalOpen,
  onExternalClose,
  hideTrigger = false,
}: {
  externalOpen?: boolean;
  onExternalClose?: () => void;
  hideTrigger?: boolean;
} = {}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const cartOpen = externalOpen || isOpen;
  const setCartOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open && onExternalClose) onExternalClose();
  };

  const { items, isLoading, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } =
    useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setCartOpen(false);
    // buildCheckoutUrl encodes variant/color info (e.g. Rhythm Band color)
    // into the URL so the checkout page can display + confirm it.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { buildCheckoutUrl } = require("@/lib/bandColors");
    const url = buildCheckoutUrl(items);
    if (url !== "/checkout") navigate(url);
  };

  return (
    <>
      {!hideTrigger && (
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      )}

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
          <SheetHeader className="flex-shrink-0 p-6 pb-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart
              {totalItems > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {totalItems}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              {totalItems === 0
                ? "Your cart is empty"
                : `${totalItems} item${totalItems !== 1 ? "s" : ""} — ${formatINR(totalPrice)}`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1 min-h-0">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add products from any product page
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantTitle}`}
                        className="flex gap-3 p-3 bg-muted/30 rounded-xl border border-border/50"
                      >
                        {item.imageUrl && (
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-tight">{item.productName}</p>
                          {item.variantTitle && item.variantTitle !== "Default Title" && (
                            <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                          )}
                          <p className="text-sm font-semibold text-primary mt-0.5">
                            {formatINR(item.price)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cross-sell / Upsell */}
                  <CartCrossSell />
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-6 pt-4 border-t space-y-3 bg-background">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-lg font-bold">{formatINR(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping & coupons applied at checkout
                  </p>
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={() => { clearCart(); setCartOpen(false); }}
                  >
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
