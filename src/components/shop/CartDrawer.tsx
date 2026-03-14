import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpayPayment,
  openRazorpayCheckout,
} from "@/lib/razorpay";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Customer info form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { items, isLoading, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } =
    useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setCheckoutOpen(true);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        return;
      }

      const orderData = await createRazorpayOrder(items, name, email, phone);

      openRazorpayCheckout(
        orderData,
        items,
        name,
        email,
        phone,
        async (response) => {
          try {
            const verified = await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              email
            );

            if (verified) {
              clearCart();
              setCheckoutOpen(false);
              setIsOpen(false);
              setOrderSuccess(true);
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch {
            toast.error("Payment verification error. Please contact care@agatsa.com");
          }
        },
        () => {
          setIsPaying(false);
          toast.info("Payment cancelled.");
        }
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed. Try again.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      {/* Cart trigger button */}
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
            {totalItems}
          </Badge>
        )}
      </Button>

      {/* Cart drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
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

                {/* Footer */}
                <div className="flex-shrink-0 p-6 pt-4 border-t space-y-3 bg-background">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-lg font-bold">{formatINR(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping calculated at checkout
                  </p>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleProceedToCheckout}
                    disabled={isLoading}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Checkout dialog — customer details */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePay} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="bg-muted/40 rounded-lg p-3 space-y-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantTitle}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-1 mt-1 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{formatINR(totalPrice)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPaying}>
              {isPaying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Opening Payment…
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay {formatINR(totalPrice)}
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success modal */}
      <Dialog open={orderSuccess} onOpenChange={setOrderSuccess}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="py-4">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Order Confirmed! 🎉</h2>
            <p className="text-muted-foreground text-sm">
              Thank you for your purchase. You'll receive a confirmation email shortly at{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              For support, contact{" "}
              <a href="mailto:care@agatsa.com" className="text-primary hover:underline">
                care@agatsa.com
              </a>
            </p>
          </div>
          <Button onClick={() => setOrderSuccess(false)}>Done</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
