import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({ title, description, canonical, ogImage, ogType = "website", jsonLd }: SEOProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);

    const url = canonical || (typeof window !== "undefined" ? window.location.href : "");
    if (url) upsertLink("canonical", url);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", ogType);
    if (url) upsertMeta("property", "og:url", url);
    if (ogImage) upsertMeta("property", "og:image", ogImage);

    upsertMeta("name", "twitter:card", ogImage ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    if (ogImage) upsertMeta("name", "twitter:image", ogImage);

    let jsonLdEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.dataset.seoHook = "true";
      jsonLdEl.text = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdEl);
    }
    return () => {
      if (jsonLdEl && jsonLdEl.parentNode) jsonLdEl.parentNode.removeChild(jsonLdEl);
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd]);
}
