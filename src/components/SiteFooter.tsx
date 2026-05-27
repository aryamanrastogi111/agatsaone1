import { Link } from "react-router-dom";
import { AppStoreBadges } from "./AppStoreBadges";
import agatsaLogo from "@/assets/agatsa-logo.webp";
import { isMyEasyTouchHost } from "@/hooks/useIsMyEasyTouch";

const productLinks = [
  { label: "Devices", href: "/devices" },
  { label: "Care Programmes", href: "/programmes" },
  ...(isMyEasyTouchHost() ? [] : [{ label: "Pricing", href: "/pricing" }]),
  { label: "Download App", href: "/app" },
  { label: "Referral Programme", href: "/app" },
];

const providerLinks = [
  { label: "For Doctors", href: "/for-doctors" },
  { label: "For Hospitals", href: "/for-hospitals" },
  { label: "For Corporates", href: "/for-corporates" },
  { label: "Partner with Us", href: "/partner" },
  { label: "Book a Demo", href: "/demo" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
];

const supportLinks = [
  { label: "Help Center", href: "/support" },
  { label: "FAQs", href: "/support#faq" },
  { label: "Device Activation", href: "/d/activate" },
];

const bottomLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Refund Policy", href: "/return-policy" },
  { label: "Data Deletion", href: "/data-deletion" },
];

export function SiteFooter() {
  return (
    <footer className="bg-dark-bg text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <img src={agatsaLogo} alt="Agatsa Logo" className="h-7 w-auto" />
              <span className="text-xl font-bold">Agatsa One</span>
              <span className="text-xl text-primary font-bold">●</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              AI health monitoring, powered by Nera AI.
            </p>
            <p className="text-sm text-white/60">
              India's most trusted cardiac monitoring app.
            </p>
            <AppStoreBadges variant="stacked" className="mt-4" />
            <p className="text-xs text-white/40 mt-2">
              Available free. Premium plans from ₹599/mo.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="font-semibold text-sm mb-4">For Providers</h4>
            <ul className="space-y-2.5">
              {providerLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-sm mb-4 mt-6">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 Agatsa Software Pvt. Ltd.</p>
          <p className="text-center">
            CDSCO Class B Medical Device
          </p>
          <div className="flex gap-4">
            {bottomLinks.map((link) => (
              <Link key={link.href} to={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-white/40 text-center mt-4 max-w-4xl mx-auto leading-relaxed">
          Agatsa One is a medical-grade monitoring aid and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical decisions. ECG validated at 98.15% sensitivity (Sri Jayadeva Institute) and 98.5% accuracy (Narayana Health). AI insights are for informational purposes only.
        </p>
      </div>
    </footer>
  );
}
