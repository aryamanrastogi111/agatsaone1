import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
  MapPin,
  Package,
  X,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpayPayment,
  openRazorpayCheckout,
} from "@/lib/razorpay";
import type { RazorpayPaymentResponse } from "@/lib/razorpay";

interface SuccessData {
  orderId: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  items: { productName: string; quantity: number; price: number; variantTitle?: string }[];
  total: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
}

// Custom modal that uses a plain fixed overlay — avoids Radix Dialog interfering with Razorpay
function CustomModal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <div className="flex min-h-full items-center justify-center p-4 py-8">
        <div
          className={`relative bg-background border border-border rounded-xl shadow-2xl w-full ${maxWidth}`}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
          {title && (
            <div className="px-6 pt-6 pb-2 pr-10">
              <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
            </div>
          )}
          <div className="px-6 pb-6 pt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  // Customer info form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // Shipping address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const { items, isLoading, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } =
    useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setIsOpen(false); // close cart drawer first
    setTimeout(() => setCheckoutOpen(true), 200);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    // Manual validation — HTML required doesn't always fire in custom modals
    if (!name.trim()) { toast.error("Please enter your full name."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email address."); return; }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) { toast.error("Please enter a valid 10-digit phone number."); return; }
    if (!address.trim()) { toast.error("Please enter your delivery address."); return; }
    if (!city.trim()) { toast.error("Please enter your city."); return; }
    if (!state.trim()) { toast.error("Please enter your state."); return; }
    if (!/^\d{6}$/.test(pincode.trim())) { toast.error("Please enter a valid 6-digit PIN code."); return; }

    setIsPaying(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsPaying(false);
        return;
      }

      const orderData = await createRazorpayOrder(
        items, name, email, phone,
        address, city, state, pincode
      );

      // Snapshot cart items & total BEFORE clearing
      const cartSnapshot = items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        price: i.price,
        variantTitle: i.variantTitle,
      }));
      const totalSnapshot = totalPrice;

      // Hide checkout modal completely before Razorpay opens
      setCheckoutOpen(false);
      setIsPaying(false);

      // Wait for modal to fully unmount
      await new Promise((r) => setTimeout(r, 400));

      openRazorpayCheckout(
        orderData,
        items,
        name,
        email,
        phone,
        async (response: RazorpayPaymentResponse) => {
          try {
            const verified = await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              {
                customerEmail: email,
                customerName: name,
                items: items,
                total: totalSnapshot,
                shippingAddress: address,
                shippingCity: city,
                shippingState: state,
                shippingPincode: pincode,
              }
            );

            if (verified) {
              clearCart();
              setSuccessData({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                customerName: name,
                customerEmail: email,
                items: cartSnapshot,
                total: totalSnapshot,
                shippingAddress: address,
                shippingCity: city,
                shippingState: state,
                shippingPincode: pincode,
              });
              // Reset form
              setName(""); setEmail(""); setPhone("");
              setAddress(""); setCity(""); setState(""); setPincode("");
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch {
            toast.error("Payment verification error. Please contact care@agatsa.com");
          }
        },
        () => {
          // User dismissed Razorpay — reopen checkout form
          setTimeout(() => setCheckoutOpen(true), 200);
          toast.info("Payment cancelled. You can try again.");
        }
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed. Try again.");
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

      {/* Checkout form — custom modal to avoid Radix interfering with Razorpay */}
      <CustomModal
        open={checkoutOpen}
        onClose={() => { if (!isPaying) setCheckoutOpen(false); }}
        title="Complete Your Order"
      >
        <form onSubmit={handlePay} className="space-y-5 pt-1">
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
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
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Address
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="address">Address Line *</Label>
                <Input
                  id="address"
                  placeholder="House/Flat No., Street, Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g. New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="e.g. Delhi"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pincode">PIN Code *</Label>
                <Input
                  id="pincode"
                  placeholder="6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-muted/40 rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Order Summary
            </p>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantTitle}`}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {item.productName}
                  {item.variantTitle && item.variantTitle !== "Default Title" && ` (${item.variantTitle})`}
                  {" "}× {item.quantity}
                </span>
                <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-1 mt-1 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{formatINR(totalPrice)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isPaying}>
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
      </CustomModal>

      {/* Success modal */}
      <CustomModal
        open={!!successData}
        onClose={() => setSuccessData(null)}
        maxWidth="max-w-md"
      >
        <div className="text-center py-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Order Confirmed! 🎉</h2>
          <p className="text-muted-foreground text-sm mb-5">
            Thank you, <span className="font-medium text-foreground">{successData?.customerName}</span>!
            Your order has been placed successfully.
          </p>
        </div>

        {successData && (
          <div className="space-y-4">
            {/* Order ID */}
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Order Reference</p>
              <p className="font-mono text-xs text-foreground break-all">{successData.orderId}</p>
              {successData.paymentId && (
                <p className="font-mono text-xs text-muted-foreground mt-0.5 break-all">
                  Payment: {successData.paymentId}
                </p>
              )}
            </div>

            {/* Items ordered */}
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2 flex items-center gap-1">
                <Package className="h-3 w-3" /> Items Ordered
              </p>
              {successData.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-0.5">
                  <span className="text-muted-foreground">
                    {item.productName}
                    {item.variantTitle && item.variantTitle !== "Default Title" && ` (${item.variantTitle})`}
                    {" "}× {item.quantity}
                  </span>
                  <span className="font-medium">{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between text-sm font-semibold">
                <span>Total Paid</span>
                <span className="text-primary">{formatINR(successData.total)}</span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Delivery To
              </p>
              <p className="text-sm text-foreground">
                {successData.shippingAddress}, {successData.shippingCity},{" "}
                {successData.shippingState} — {successData.shippingPincode}
              </p>
            </div>

            {/* Email confirmation */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
              <p className="text-sm text-foreground font-medium">
                📧 Order confirmation email sent to
              </p>
              <p className="text-sm text-primary font-semibold mt-0.5">{successData.customerEmail}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Need help?{" "}
                <a href="mailto:care@agatsa.com" className="text-primary hover:underline">
                  care@agatsa.com
                </a>
              </p>
            </div>
          </div>
        )}

        <Button
          className="w-full mt-4"
          onClick={() => setSuccessData(null)}
        >
          Continue Shopping
        </Button>
      </CustomModal>
    </>
  );
};
