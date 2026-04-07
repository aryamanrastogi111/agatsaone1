import { SiteLayout } from "@/components/SiteLayout";
import { AppStoreBadges } from "@/components/AppStoreBadges";

export default function AppDownloadPage() {
  return (
    <SiteLayout>
      <section className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Download Agatsa One</h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Get the app to monitor your heart health, track vitals, and connect your devices.
          </p>
          <AppStoreBadges className="justify-center" />
        </div>
      </section>
    </SiteLayout>
  );
}
