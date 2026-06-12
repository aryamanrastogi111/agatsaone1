import { useState } from "react";
import { ArrowRight, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function NeraLicenseDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    requirement: "",
  });

  const update = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, company, email, phone, requirement } = form;
    if (!name.trim() || !company.trim() || !email.trim() || !phone.trim() || !requirement.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-nera-license-enquiry", {
        body: {
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          requirement: requirement.trim(),
        },
      });
      if (error) throw error;
      toast.success("Thanks! Our team will reach out within 1 business day.");
      setForm({ name: "", company: "", email: "", phone: "", requirement: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not send. Please email info@agatsa.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>License NERA AI</DialogTitle>
          <DialogDescription>
            Tell us about your product. Our team responds within 1 business day.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nera-name">Name *</Label>
              <Input id="nera-name" value={form.name} onChange={update("name")} maxLength={120} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nera-company">Company *</Label>
              <Input id="nera-company" value={form.company} onChange={update("company")} maxLength={160} required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nera-email">Work email *</Label>
              <Input id="nera-email" type="email" value={form.email} onChange={update("email")} maxLength={200} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nera-phone">Phone *</Label>
              <Input id="nera-phone" type="tel" value={form.phone} onChange={update("phone")} maxLength={40} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nera-req">Requirement *</Label>
            <Textarea
              id="nera-req"
              value={form.requirement}
              onChange={update("requirement")}
              maxLength={2000}
              rows={4}
              placeholder="Briefly describe your device, signals available (HR, HRV, SpO2, ECG, sleep), and what you'd like NERA AI to power."
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full h-11 btn-glow">
            {submitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
            ) : (
              <>Send Enquiry <ArrowRight className="ml-1 w-4 h-4" /></>
            )}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Goes directly to info@agatsa.com
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NeraLicenseButton({ variant = "outline" }: { variant?: "outline" | "default" }) {
  const scrollToBusiness = () => {
    const el = document.getElementById("nera-for-business");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  if (variant === "outline") {
    return (
      <Button
        size="lg"
        variant="outline"
        onClick={scrollToBusiness}
        className="text-base px-8 h-12 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
      >
        <Building2 className="mr-2 w-4 h-4" />
        License NERA AI for Business
      </Button>
    );
  }
  return (
    <Button size="lg" onClick={scrollToBusiness} className="text-base px-8 h-12 btn-glow">
      <Building2 className="mr-2 w-4 h-4" />
      License NERA AI for Business
    </Button>
  );
}
