// src/pages/admin/Reviews.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Star, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string; rating: number; title: string; body: string;
  status: string; created_at: string;
  products: { name: string } | null;
  profiles: { full_name: string; email: string } | null;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const fetchReviews = async () => {
    let query = supabase.from("reviews").select("*, products(name), profiles(full_name, email)").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setReviews((data ?? []) as Review[]);
    setLoading(false);
  };
  useEffect(() => { fetchReviews(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("reviews").update({ status }).eq("id", id);
    toast.success(`Review ${status}`);
    fetchReviews();
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={13} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
          <p className="text-sm text-gray-500">{reviews.length} reviews</p>
        </div>
        <div className="flex gap-2">
          {["pending", "approved", "rejected", "all"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : reviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl text-center py-16 shadow-sm">
            <Star className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">No {filter !== "all" ? filter : ""} reviews</p>
          </div>
        ) : reviews.map(review => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString("en-IN")}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${review.status === "approved" ? "bg-green-100 text-green-700" : review.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {review.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{review.title}</p>
                <p className="text-sm text-gray-500 mt-1">{review.body}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>Product: {review.products?.name ?? "—"}</span>
                  <span>By: {review.profiles?.full_name || review.profiles?.email || "Anonymous"}</span>
                </div>
              </div>
              {review.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => updateStatus(review.id, "approved")} className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"><Check size={15} /></button>
                  <button onClick={() => updateStatus(review.id, "rejected")} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><X size={15} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
