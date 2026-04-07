import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReferralPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      localStorage.setItem("referralCode", code);
      if ((window as any).gtag) {
        (window as any).gtag("event", "referral_link_clicked", { code });
      }
      navigate(`/app?ref=${code}`, { replace: true });
    }
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="h-8 w-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground">Applying your invitation...</p>
      </div>
    </div>
  );
}
