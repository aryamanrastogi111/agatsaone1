import { SiteLayout } from "@/components/SiteLayout";

export default function HomePage() {
  return (
    <SiteLayout>
      <section className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4">
            Your Heart Health, <span className="text-primary">Reimagined</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Medical-grade health monitoring powered by AI. Coming soon with full page content.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
