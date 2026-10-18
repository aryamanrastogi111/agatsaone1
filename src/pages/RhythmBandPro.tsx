import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, HeartPulse, MoonStar, Footprints, Waves, Wind, NotebookPen, Activity, Utensils, Minus, Plus, ShoppingCart, Play } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { ProductReviewsSection } from "@/components/products/ProductReviewsSection";
import { RhythmScrollNav } from "@/components/rhythm/RhythmScrollNav";
import foodRice from "@/assets/rhythm-food-rice.jpg";
import foodMango from "@/assets/rhythm-food-mango.jpg";
import foodPizza from "@/assets/rhythm-food-pizza.jpg";
import foodChai from "@/assets/rhythm-food-chai.jpg";
import foodBanana from "@/assets/rhythm-food-banana.jpg";
import foodIcecream from "@/assets/rhythm-food-icecream.jpg";
import { RhythmResearch } from "@/components/rhythm/RhythmResearch";
import { RhythmGoalCard } from "@/components/rhythm/RhythmGoalCard";
import { easytouchRhythmReviews } from "@/data/easytouchRhythmReviews";
import { RHYTHM_CAMPAIGNS, getRhythmExperience, selectRhythmAngle, recordRhythmInteraction, type RhythmAngle } from "@/lib/rhythmCampaign";
import { encodeVariantsParam, BAND_SKU } from "@/lib/bandColors";
import { getNeraAiIncludedLine } from "@/lib/neraAiPlan";
import { usePricing } from "@/hooks/useDevicePricing";
import { useSEO } from "@/hooks/useSEO";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import portrait1 from "@/assets/rhythm-real-rohan.jpg";
import portrait2 from "@/assets/rhythm-real-aditi.jpg";
import portrait3 from "@/assets/rhythm-real-menon.jpg";
import appWearable from "@/assets/rhythm-app-wearable.png.asset.json";
import appMeals from "@/assets/rhythm-meals-compatible.jpg.asset.json";
import appMetabolic from "@/assets/rhythm-metabolic-compatible.jpg.asset.json";
import appMealResponse from "@/assets/rhythm-app-meal-response.png.asset.json";
import spikeDemo from "@/assets/rhythm-spike-demo.mp4.asset.json";
import bandOlive from "@/assets/bands/band-olive.png.asset.json";
import bandOliveHero from "@/assets/bands/band-olive-hero.png.asset.json";
import bandGraphite from "@/assets/bands/band-graphite.png.asset.json";
import bandKhaki from "@/assets/bands/band-khaki.png.asset.json";
import bandSlate from "@/assets/bands/band-slate.png.asset.json";
import bandRosewood from "@/assets/bands/band-rosewood.png.asset.json";
import bandTeal from "@/assets/bands/band-teal.png.asset.json";

const COLORS = [
  { id: "olive", name: "Olive", photo: bandOlive.url },
  { id: "graphite", name: "Graphite", photo: bandGraphite.url },
  { id: "khaki", name: "Khaki", photo: bandKhaki.url },
  { id: "slate", name: "Slate", photo: bandSlate.url },
  { id: "rosewood", name: "Rosewood", photo: bandRosewood.url },
  { id: "teal", name: "Teal", photo: bandTeal.url },
];
const CAPABILITIES = [
  { icon: HeartPulse, title: "Heart rate", copy: "Follow resting heart rate and everyday heart-rate trends." },
  { icon: Waves, title: "HRV & readiness", copy: "Look at changes in heart-rate variability alongside your daily routine." },
  { icon: MoonStar, title: "Sleep", copy: "Review sleep stages and the patterns in your nights." },
  { icon: Activity, title: "Recovery", copy: "Put rest, activity and recovery insights side by side." },
  { icon: Wind, title: "Stress", copy: "Explore lifestyle and recovery insights in NERA." },
  { icon: Footprints, title: "Activity & movement", copy: "Keep track of steps and everyday movement." },
  { icon: Utensils, title: "Food intelligence", copy: "Add meal context to explore inferred metabolic-response patterns, not measured sugar levels." },
  { icon: NotebookPen, title: "NERA guidance", copy: "Bring your available wellness signals together in the Agatsa One app." },
];
const STEPS = [
  { icon: NotebookPen, title: "Log Your Meal", copy: "Add what you ate. A little context helps you look back at your food habits." },
  { icon: Activity, title: "Track With Rhythm Band", copy: "Wear the band to follow supported activity, sleep and wellness signals." },
  { icon: Waves, title: "Understand Your Patterns", copy: "Review meals alongside your available wearable insights over time." },
  { icon: Footprints, title: "Make Better Choices", copy: "Try a small change to portions, food combinations, movement or routines." },
];
const FAQS = [
  { q: "How can Rhythm Band help me build healthier eating habits?", a: "Meal logging adds context to the wellness trends in Agatsa One. Looking back at meals, activity and sleep together can help you notice habits and make practical changes. Inferred trends do not establish exact sugar responses to a food." },
  { q: "Does it help with weight management?", a: "Rhythm Band supports awareness of food and activity habits. Weight changes depend on many factors; the band does not guarantee weight loss or prescribe a diet." },
  { q: "Does Rhythm Band measure blood sugar?", a: "No. It collects wearable wellness signals and uses an algorithm to infer metabolic-response trends. These are not direct or clinically established sugar measurements. They must not be used to diagnose a condition or change medication." },
  { q: "Is this a replacement for a CGM or glucometer?", a: "No. Continue using the measurement device and medical advice recommended by your clinician. Rhythm Band does not replace a CGM, glucometer or ECG." },
  { q: "What does NERA show me?", a: "The Agatsa One app brings available wearable information, such as heart rate, HRV, activity, sleep and recovery, together with meal context. The metabolic trend feature is an inferred wellness signal, not a measured sugar reading." },
  { q: "Do I need to photograph every meal?", a: "This page uses meal logging rather than promising photo analysis. Meal-photo analysis has not been confirmed for the released Rhythm experience. Add meal context when it is useful to you." },
  { q: "What happens if I forget to log a meal?", a: "The wearable can still collect supported wellness signals. An unlogged meal provides no meal context for your review; do not assume the band knows exactly what you ate." },
  { q: "Is this a smartwatch?", a: "No. Rhythm Band is screenless, with no notifications on your wrist. Review your information on your phone in Agatsa One." },
  { q: "What is included with the band?", a: "Rhythm Band, magnetic charger, quick-start card and seven days of Nera AI Premium. The trial activates when you pair the device in Agatsa One." },
  { q: "Is there a subscription after purchase?", a: "Seven days of Nera AI Premium are included, not unlimited free Premium access. Refer to the current NERA plans in the app for access and pricing after the trial; no ongoing free subscription is promised here." },
  { q: "Which phones are compatible?", a: "Agatsa One is intended for Android and iOS devices released from 2018 onwards. Pair the band with the app through Bluetooth." },
  { q: "How long does the battery last?", a: "The existing product specification lists up to seven days per charge. Actual battery life varies with use. A magnetic charger is included." },
  { q: "Can I wear it in water?", a: "The existing specification is IP67. Sweat, rain and handwashing are supported; avoid swimming." },
  { q: "What is the warranty and return policy?", a: "The existing offer includes a one-year warranty. Returns must be requested within seven days of delivery and are accepted for verified manufacturing defects, subject to inspection and original packaging. Read the return policy for complete conditions." },
  { q: "What about shipping?", a: "Shipping in India is free. International shipping is a flat ₹3,000 per order. Delivery estimates vary by destination; see the shipping policy for details." },
];

function ColorSelector({ selected, onChange }: { selected: string; onChange: (color: typeof COLORS[number]) => void }) {
  return <div className="flex flex-wrap gap-3" aria-label="Band colours">{COLORS.map(color => <Button key={color.id} size="icon" variant="outline" aria-label={color.name} title={color.name} aria-pressed={selected === color.id} onClick={() => onChange(color)} className={`h-11 w-11 rounded-full p-1 ${selected === color.id ? "border-primary ring-1 ring-ring" : "border-border"}`}><span className={`rhythm-swatch-${color.id} flex h-full w-full items-center justify-center rounded-full`}>{selected === color.id && <Check className="h-4 w-4 text-primary-foreground" />}</span></Button>)}</div>;
}

export default function RhythmBandPro() {
  const { prices, fmt } = usePricing();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = `?${searchParams.toString()}`;
  const { hero, selectedGoal: angle } = getRhythmExperience(search);
  const campaign = angle ? RHYTHM_CAMPAIGNS[angle] : null;
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const cartHasItems = useCartStore(state => state.items.length > 0);
  const price = prices.band_sub;
  const topReviews = useMemo(() => {
    const pick = (rating: number, count: number) => easytouchRhythmReviews.filter(review => review.rating === rating).sort((a,b) => b.date.localeCompare(a.date)).slice(0,count);
    return [...pick(5,15), ...pick(4,3), ...pick(3,2)].sort((a,b) => b.date.localeCompare(a.date));
  }, []);
  useSEO({ title: "EasyTouch Rhythm Band — Food, Sleep & Daily Wellness | Agatsa One", description: "Explore your food habits, activity, sleep and inferred metabolic trends with EasyTouch Rhythm Band and NERA. Includes a seven-day Nera AI Premium trial." });
  useMetaPixelViewContent("RHYTHM_BAND", "EasyTouch Rhythm Band", price);
  useEffect(() => { recordRhythmInteraction("landing_view", window.location.search); }, []);

  const addToCart = (qty: number) => {
    useCartStore.getState().addItem({ productId: BAND_SKU, productName: "EasyTouch Rhythm Band", variantTitle: selectedColor.name, price, quantity: qty });
    recordRhythmInteraction("add_to_cart", search);
    toast.success(`Rhythm Band · ${selectedColor.name} added`, { position: "top-center" });
    try {
      if (window.fbq) window.fbq("track", "AddToCart", { content_ids: [BAND_SKU], content_name: "EasyTouch Rhythm Band", content_type: "product", value: price * qty, currency: "INR" });
    } catch { /* An existing advertising tag must not block checkout. */ }
  };
  const buyNow = (qty: number) => {
    addToCart(qty);
    recordRhythmInteraction("buy_now", search);
    const variants = encodeVariantsParam({ [BAND_SKU]: selectedColor.name });
    const sku = Array.from({ length: qty }, () => BAND_SKU).join(",");
    navigate(`/checkout?sku=${sku}&variants=${variants}`);
  };
  const selectGoal = (goal: RhythmAngle) => {
    const next = selectRhythmAngle(search, goal);
    recordRhythmInteraction("goal_selection", next);
    setSearchParams(new URLSearchParams(next), { replace: true });
  };

  return <SiteLayout><div className="rhythm-page">
    <section className="overflow-hidden">
      <div className="rhythm-container pb-5 pt-5 text-center md:pt-12">
        <p className="rhythm-eyebrow">AGATSA ONE / EASYTOUCH RHYTHM BAND</p>
        <h1 className="mx-auto max-w-4xl text-[38px] font-semibold leading-[1.1] md:text-[60px]">{hero.headline}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{hero.copy}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:gap-4">
          <Button asChild size="lg" className="h-12 px-7"><a href="#buy" onClick={() => recordRhythmInteraction("hero_cta", search)}>Get yours — {fmt(price)} <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          <Button asChild variant="link" className="text-foreground"><a href="#proof-video">See how it works <Play className="ml-2 h-4 w-4" /></a></Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{getNeraAiIncludedLine(BAND_SKU)} · Free shipping in India</p>
        <img src={bandOliveHero.url} alt="EasyTouch Rhythm Band in Olive" fetchPriority="high" className="mx-auto mt-3 h-[175px] w-full max-w-2xl object-contain md:h-[285px]" />
        <p className="mt-3 text-sm text-muted-foreground">Screenless. By design. <span className="text-foreground">Available in six colours.</span></p>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground">Food-response patterns are inferred wellness trends, not direct sugar measurements or proof that a food causes a measured spike.</p>
      </div>
    </section>
    <section className="rhythm-section"><div className="rhythm-container grid items-center gap-10 md:grid-cols-2">
      <div>
        <p className="rhythm-eyebrow">Automatic spike detection</p>
        <h2 className="rhythm-heading">Your spikes, detected on their own —<br /><span className="text-muted-foreground">by Rhythm Band.</span></h2>
        <p className="rhythm-copy mt-5">Wear the band and NERA keeps watching through the day. When a metabolic spike rises after a meal and settles back down, the band and app detect it automatically — no finger pricks, no strips, no manual checks.</p>
        <p className="rhythm-copy mt-4">You simply log what you ate. Agatsa One recognizes the food and files it into your food profile — roti, rice, chai, a restaurant meal — and links the detected response to that meal, so you can see how your body handled it.</p>
      </div>
      <figure className="rhythm-phone-stage">
        <img src={appMealResponse.url} alt="Agatsa One screen showing NERA watching the response to roti and paneer curry, measured from the Rhythm Band" loading="lazy" className="mx-auto h-[520px] w-full max-w-xs object-contain" />
        <figcaption className="mt-4 text-center text-xs text-muted-foreground">Actual Agatsa One screen · NERA watching a meal response</figcaption>
      </figure>
    </div></section>
    <section className="border-t border-border bg-muted py-7">
      <div className="rhythm-container"><h2 className="text-lg font-semibold">What would you like to understand better?</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-3">{(Object.keys(RHYTHM_CAMPAIGNS) as RhythmAngle[]).map(goal => <Button key={goal} variant={angle === goal ? "default" : "outline"} aria-pressed={angle === goal} onClick={() => selectGoal(goal)} className="h-auto min-h-12 justify-between whitespace-normal px-4 py-3 text-left">{RHYTHM_CAMPAIGNS[goal].goal}<ArrowRight className="ml-2 h-4 w-4 shrink-0" /></Button>)}</div>
        <p className="mt-3 min-h-5 text-sm text-muted-foreground" aria-live="polite">{campaign?.explanation || "Food, movement and sleep. Start with what matters to you."}</p>
        <div aria-live="polite" aria-atomic="true">{angle && <RhythmGoalCard angle={angle} />}</div>
      </div>
    </section>
    <RhythmScrollNav />
    <section id="discover" className="rhythm-section"><div className="rhythm-container">
      <p className="rhythm-eyebrow">Everyday food. Personal patterns.</p><h2 className="rhythm-heading">Which food fits your day?</h2><p className="rhythm-copy mt-5 max-w-2xl">Rice, mango, pizza, chai, banana or ice cream. The food is familiar. Portions, timing, movement and your own routine make the context personal.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{[{label:"Rice",img:foodRice},{label:"Mango",img:foodMango},{label:"Pizza",img:foodPizza},{label:"Chai",img:foodChai},{label:"Banana",img:foodBanana},{label:"Ice cream",img:foodIcecream}].map(food => <figure key={food.label} className="rhythm-food-card"><div className="aspect-square overflow-hidden"><img src={food.img} alt={food.label} width={512} height={512} loading="lazy" className="h-full w-full object-cover" /></div><figcaption className="p-4"><h3 className="text-base font-semibold">{food.label}</h3><p className="mt-2 text-xs">What's your pattern?</p></figcaption></figure>)}</div>
    </div></section>
    <section className="rhythm-section bg-muted"><div className="rhythm-container">
      <p className="rhythm-eyebrow">One meal isn't the whole story</p><h2 className="rhythm-heading">The same food.<br /><span className="text-muted-foreground">Different bodies.</span></h2><p className="rhythm-copy mt-5 max-w-2xl">Nobody responds to food in exactly the same way. Your portions, daily movement and sleep are part of the picture.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{[{name:"Rohan, 41", img:portrait1, note:"A desk day and a late lunch."},{name:"Aditi, 28",img:portrait2,note:"The same meal after an active morning."},{name:"Mr. Menon, 65",img:portrait3,note:"A smaller portion and a walk afterwards."}].map(person => <figure key={person.name} className="rhythm-food-card"><img src={person.img} alt={`${person.name} — illustrative portrait`} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover" /><figcaption className="p-5"><h3 className="text-base">{person.name}</h3><p className="mt-1 text-sm text-muted-foreground">{person.note}</p></figcaption></figure>)}</div>
    </div></section>
    <RhythmResearch />
    <section className="rhythm-section bg-muted"><div className="rhythm-container">
      <p className="rhythm-eyebrow">A routine, not a rulebook</p><h2 className="rhythm-heading">Small Changes.<br />Better Daily Habits.</h2>
      <div className="mt-8 grid gap-8 md:grid-cols-4">{[{title:"Your lunch",copy:"Rice, dal, sabzi and roti. Look at the meal and your portions."},{title:"Your afternoon",copy:"Notice how much you've moved. Consider a short walk."},{title:"Your evening",copy:"Look back at the day's habits, activity and sleep routine."},{title:"Your next day",copy:"Choose one small, practical improvement. Then keep going."}].map((item,i) => <div key={item.title} className="rhythm-feature-card"><span className="text-sm text-primary">0{i+1}</span><h3 className="mt-4 text-lg">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.copy}</p></div>)}</div>
    </div></section>
    <section className="rhythm-section"><div className="rhythm-container">
      <p className="rhythm-eyebrow">Your Personal Food Profile · Trends in the actual app</p><h2 className="rhythm-heading max-w-3xl">Learn about your meals.<br />Not somebody else's.</h2><p className="rhythm-copy mt-5 max-w-2xl">Add meal context and review the patterns over time. NERA brings food, rest and movement together — without turning an inferred trend into an exact sugar reading.</p>
      <div className="mt-10 grid gap-10 md:grid-cols-2"><figure className="rhythm-phone-stage"><img src={appMeals.url} alt="Actual Agatsa One meal-response screen" loading="lazy" className="mx-auto h-[440px] w-full max-w-xs object-contain" /><figcaption className="mt-4 text-center text-xs text-muted-foreground">Actual app screen · meal context and inferred trends</figcaption></figure><figure className="rhythm-phone-stage"><img src={appMetabolic.url} alt="Actual NERA metabolic trend screen" loading="lazy" className="mx-auto h-[440px] w-full max-w-xs object-contain" /></figure></div>
    </div></section>
    <section id="how-it-works" className="rhythm-section bg-muted"><div className="rhythm-container"><p className="rhythm-eyebrow">How it works</p><h2 className="rhythm-heading">A little context.<br />A clearer daily picture.</h2><div className="mt-10 grid gap-8 md:grid-cols-4">{STEPS.map((step,i) => <div key={step.title} className="rhythm-feature-card"><step.icon className="h-7 w-7 text-primary" /><p className="mt-5 text-xs text-muted-foreground">0{i+1}</p><h3 className="mt-2 text-lg">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.copy}</p></div>)}</div></div></section>
    <section id="proof-video" className="rhythm-section scroll-mt-24"><div className="rhythm-container grid items-center gap-10 md:grid-cols-2"><div><p className="rhythm-eyebrow">The actual app</p><h2 className="rhythm-heading">See the experience.</h2><p className="rhythm-copy mt-5">The original app recording shows the interface and its recorded trend labels. Those labels are not evidence of insulin detection, clinical accuracy or a measured sugar spike.</p></div><video src={spikeDemo.url} controls muted playsInline preload="metadata" className="mx-auto max-h-[520px] w-full max-w-xs rounded-lg bg-muted" aria-label="Original Rhythm app demonstration" /></div></section>
    <section className="rhythm-section bg-muted"><div className="rhythm-container"><p className="rhythm-eyebrow">More than meals</p><h2 className="rhythm-heading">One band.<br /><span className="text-muted-foreground">Your everyday wellness.</span></h2><div className="mt-10 grid items-start gap-12 md:grid-cols-[1fr_2fr]"><figure className="rhythm-phone-stage"><img src={appWearable.url} alt="Actual Rhythm wearable dashboard with heart rate, HRV, sleep and activity" loading="lazy" className="mx-auto h-[490px] w-full max-w-xs object-contain" /><figcaption className="mt-3 text-center text-xs text-muted-foreground">Actual Agatsa One wearable screen</figcaption></figure><div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">{CAPABILITIES.map(item => <div key={item.title} className="rhythm-feature-card"><item.icon className="h-5 w-5 text-primary" /><h3 className="mt-3 text-base">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p></div>)}</div></div></div></section>
    <section className="rhythm-section bg-muted"><div className="rhythm-container"><h2 className="rhythm-heading">Not just a step count.</h2><div className="mt-8 overflow-x-auto"><table className="w-full min-w-[310px] text-left text-sm"><thead><tr className="border-b border-border"><th className="py-4 font-medium">What you want to explore</th><th className="py-4 font-medium">Rhythm Band</th></tr></thead><tbody>{["Heart rate, HRV and activity", "Sleep and recovery patterns", "Meal context and inferred metabolic trends", "NERA guidance in Agatsa One", "Screenless wear, without wrist notifications", "Seven days of Nera AI Premium included"].map(feature => <tr key={feature} className="border-b border-border"><td className="py-4 pr-5">{feature}</td><td className="py-4"><Check aria-label="Included" className="h-4 w-4 text-primary" /></td></tr>)}</tbody></table></div><p className="mt-4 text-xs text-muted-foreground">Features vary across other wearables. No blanket competitor claim or medical equivalence is implied.</p></div></section>
    <section id="buy" className="rhythm-section scroll-mt-24"><div className="rhythm-container"><p className="rhythm-eyebrow">EasyTouch Rhythm Band</p><h2 className="rhythm-heading">Screenless. By design.</h2><div className="mt-6 grid items-center gap-10 md:grid-cols-2"><img src={selectedColor.photo} alt={`EasyTouch Rhythm Band in ${selectedColor.name}`} loading="lazy" className="aspect-square w-full max-w-lg object-contain" /><div className="rhythm-feature-card"><h3 className="text-2xl">Your band. Your colour.</h3><p className="mt-3 text-muted-foreground">Nothing to check on your wrist. Your answers live on your phone.</p><p className="mt-6 text-sm font-medium">{selectedColor.name} · {COLORS.findIndex(color => color.id === selectedColor.id)+1} of 6 colours</p><div className="mt-3"><ColorSelector selected={selectedColor.id} onChange={setSelectedColor} /></div><p className="mt-7 text-3xl font-semibold">{fmt(price)}</p><p className="mt-2 text-sm text-muted-foreground">{getNeraAiIncludedLine(BAND_SKU)}</p><p className="mt-1 text-sm text-muted-foreground">Free shipping in India</p><div className="mt-5"><StockUrgencyBar productKey="easytouch-rhythm" /></div><div className="mt-5 inline-flex items-center rounded-lg border border-border"><Button aria-label="Decrease purchase quantity" title="Decrease quantity" variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1,q-1))}><Minus className="h-4 w-4" /></Button><span className="w-8 text-center text-sm" aria-label="Purchase quantity">{quantity}</span><Button aria-label="Increase purchase quantity" title="Increase quantity" variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(5,q+1))}><Plus className="h-4 w-4" /></Button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Button variant="outline" size="lg" onClick={() => addToCart(quantity)}><ShoppingCart className="mr-2 h-4 w-4" />Add to cart</Button><Button size="lg" onClick={() => buyNow(quantity)}>Buy now · {selectedColor.name}<ArrowRight className="ml-2 h-4 w-4" /></Button></div><p className="mt-4 text-xs text-muted-foreground">One-year warranty · Defect returns subject to inspection</p><div className="mt-4 flex gap-5 text-xs"><a href="/return-policy" className="underline underline-offset-4">Return policy</a><a href="/shipping-policy" className="underline underline-offset-4">Shipping policy</a></div></div></div></div></section>
    <section className="rhythm-section bg-muted"><div className="rhythm-container max-w-3xl"><p className="rhythm-eyebrow">A few things worth knowing</p><h2 className="rhythm-heading">Questions.</h2><Accordion type="single" collapsible className="mt-6">{FAQS.map((faq,i) => <AccordionItem key={faq.q} value={`faq-${i}`}><AccordionTrigger className="text-left">{faq.q}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{faq.a}</AccordionContent></AccordionItem>)}</Accordion></div></section>
    <ProductReviewsSection reviews={topReviews} heading="Rhythm Band reviews" sampleReviews />
    {!cartHasItems && <StickyAddToCart productName={`EasyTouch Rhythm Band · ${selectedColor.name}`} price={fmt(price)} unitPrice={price} onBuyNow={buyNow} onAddToCart={addToCart} />}
  </div></SiteLayout>;
}
