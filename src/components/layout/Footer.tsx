import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import agatsaLogo from "@/assets/agatsa-logo.png";

const productLinks = [
  { label: "SanketLife", href: "https://sanketlife.com", external: true },
  { label: "EasyTouch Rhythm", href: "https://easytouchrhythm.com", external: true },
  { label: "Zlu – Sleep Aid", href: "/products/zlu" },
  { label: "CoreBalance BMI", href: "/products/corebalance" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Trust & Certifications", href: "/trust" },
  { label: "Solutions", href: "/solutions" },
  { label: "Careers", href: "/about#careers" },
];

const supportLinks = [
  { label: "Help Center", href: "/support" },
  { label: "Contact Us", href: "/support#contact" },
  { label: "FAQs", href: "/support#faq" },
  { label: "Warranty", href: "/support#warranty" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Return Policy", href: "/returns" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={agatsaLogo} alt="Agatsa" className="h-8 w-8 object-contain" />
              <span className="font-semibold text-xl">Agatsa</span>
            </div>
            <p className="text-secondary-foreground/80 text-sm mb-6 max-w-sm">
              Smart, non-invasive health devices designed to help you understand your body better — at home and on the go.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:support@agatsa.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                support@agatsa.com
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +91 123 456 7890
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="text-secondary-foreground/80">
                  New Delhi, India
                </span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-3 text-sm">
              {productLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label} ↗
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-secondary-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} Agatsa. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-secondary-foreground/60 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
