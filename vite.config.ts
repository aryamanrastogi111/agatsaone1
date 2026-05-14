import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode !== "development" &&
      prerender({
        routes: ["/lose-belly"],
        renderer: "@prerenderer/renderer-puppeteer",
        rendererOptions: {
          renderAfterTime: 2500,
          maxConcurrentRoutes: 1,
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
        postProcess(renderedRoute: { html: string; route: string }) {
          // Strip any inline scripts that may capture runtime state we don't want frozen
          renderedRoute.html = renderedRoute.html.replace(
            /<script (?:type="application\/json"|data-prerender-state)[^>]*>[\s\S]*?<\/script>/g,
            "",
          );
          return renderedRoute;
        },
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
