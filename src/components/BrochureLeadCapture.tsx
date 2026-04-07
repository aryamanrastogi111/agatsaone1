import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";

interface BrochureLeadCaptureProps {
  brochureType: "doctors" | "hospitals" | "corporates";
  brochurePath: string;
  buttonText?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
}

const brochureLabels = {
  doctors: "Doctors & Clinics Brochure",
  hospitals: "Hospital Brochure",
  corporates: "Corporate Wellness Brochure",
};

export function BrochureLeadCapture({
  brochureType,
  brochurePath,
  buttonText = "Download Brochure",
  buttonClassName = "",
  children,
}: BrochureLeadCaptureProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;

    setLoading(true);
    try {
      // Fire and forget — don't block download on email success
      supabase.functions.invoke("send-lead-email", {
        body: {
          name: form.name,
          email: form.email,
          company: form.company,
          brochureType,
        },
      }).catch(console.error);

      // Trigger download immediately
      const link = document.createElement("a");
      link.href = brochurePath;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Your brochure is downloading!");
      setOpen(false);
      setForm({ name: "", email: "", company: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={() => setOpen(true)} className="cursor-pointer">
          {children}
        </span>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={buttonClassName || "border-2 border-[#7C4DFF] text-[#7C4DFF] rounded-full px-8 py-4 text-base font-semibold hover:bg-purple-50 transition"}
        >
          {buttonText}
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {brochureLabels[brochureType]}
            </DialogTitle>
            <DialogDescription>
              Enter your details to download the brochure. We'll also send you updates relevant to your interest.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="lead-name">Name</Label>
              <Input
                id="lead-name"
                placeholder="Dr. Priya Sharma"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lead-email">Work Email *</Label>
              <Input
                id="lead-email"
                type="email"
                required
                placeholder="priya@hospital.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lead-company">Organisation / Clinic</Label>
              <Input
                id="lead-company"
                placeholder="Apollo Hospitals"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full gap-2">
              <Download className="h-4 w-4" />
              {loading ? "Preparing..." : "Download Brochure"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We respect your privacy. No spam. Unsubscribe anytime.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
