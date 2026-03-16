import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PixelConfig {
  platform: string;
  is_enabled: boolean;
  config: Record<string, string>;
}

function injectScript(id: string, html: string) {
  if (document.getElementById(id)) return;
  const range = document.createRange();
  range.selectNode(document.head);
  const frag = range.createContextualFragment(html);
  // For noscript we append to body, scripts to head
  const scripts = frag.querySelectorAll("script");
  scripts.forEach((s) => {
    const el = document.createElement("script");
    if (s.src) el.src = s.src;
    el.async = s.async;
    el.id = id + "-script";
    el.textContent = s.textContent;
    document.head.appendChild(el);
  });
}

function injectGTM(containerId: string) {
  if (!containerId || document.getElementById("pixel-gtm")) return;
  // GTM head script
  const s = document.createElement("script");
  s.id = "pixel-gtm";
  s.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${containerId}');`;
  document.head.appendChild(s);
  // GTM body noscript (only once)
  if (!document.getElementById("pixel-gtm-noscript")) {
    const ns = document.createElement("noscript");
    ns.id = "pixel-gtm-noscript";
    ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(ns, document.body.firstChild);
  }
}

function injectGA4(measurementId: string) {
  if (!measurementId || document.getElementById("pixel-ga4")) return;
  const s1 = document.createElement("script");
  s1.id = "pixel-ga4";
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.id = "pixel-ga4-config";
  s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`;
  document.head.appendChild(s2);
}

function injectMetaPixel(pixelId: string) {
  if (!pixelId || document.getElementById("pixel-meta")) return;
  const s = document.createElement("script");
  s.id = "pixel-meta";
  s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
  document.head.appendChild(s);
}

function injectTikTok(pixelId: string) {
  if (!pixelId || document.getElementById("pixel-tiktok")) return;
  const s = document.createElement("script");
  s.id = "pixel-tiktok";
  s.textContent = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${pixelId}');ttq.page();}(window,document,'ttq');`;
  document.head.appendChild(s);
}

function injectPinterest(tagId: string) {
  if (!tagId || document.getElementById("pixel-pinterest")) return;
  const s = document.createElement("script");
  s.id = "pixel-pinterest";
  s.textContent = `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','${tagId}');pintrk('page');`;
  document.head.appendChild(s);
}

export function useTrackingPixels() {
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("tracking_pixels" as any)
          .select("platform, is_enabled, config");

        if (error || !data) return;

        (data as unknown as PixelConfig[]).forEach((pixel) => {
          if (!pixel.is_enabled) return;
          const cfg = pixel.config || {};

          switch (pixel.platform) {
            case "gtm":
              if (cfg.container_id) injectGTM(cfg.container_id);
              break;
            case "ga4":
              if (cfg.measurement_id) injectGA4(cfg.measurement_id);
              break;
            case "meta_pixel":
              if (cfg.pixel_id) injectMetaPixel(cfg.pixel_id);
              break;
            case "tiktok":
              if (cfg.pixel_id) injectTikTok(cfg.pixel_id);
              break;
            case "pinterest":
              if (cfg.tag_id) injectPinterest(cfg.tag_id);
              break;
            // meta_capi is server-side only, no client injection needed
          }
        });
      } catch {
        // silently fail — never break the site
      }
    })();
  }, []);
}
