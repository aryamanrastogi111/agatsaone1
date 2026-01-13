export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  image: string;
  category: "heart" | "wellness" | "sleep" | "weight";
  isExternal: boolean;
  link: string;
  price?: string;
  features?: string[];
}

export const products: Product[] = [
  {
    id: "sanketlife",
    name: "SanketLife",
    tagline: "Your Heart, in Your Hands",
    description: "A portable, medical-grade ECG device that lets you monitor your heart health anytime, anywhere.",
    benefits: [
      "12-lead ECG quality in your pocket",
      "Instant PDF reports via smartphone",
      "Doctor-shareable records"
    ],
    image: "https://www.agatsaone.com/cdn/shop/files/SanketLifeDevice2.png?v=1700000000",
    category: "heart",
    isExternal: true,
    link: "https://sanketlife.com",
    features: [
      "Medical-grade accuracy",
      "FDA & CE certified",
      "No gels or wires needed",
      "Works with iOS & Android"
    ]
  },
  {
    id: "easytouch-rhythm",
    name: "EasyTouch Rhythm",
    tagline: "Wellness on Your Wrist",
    description: "A smart health band that tracks your vitals 24/7, helping you stay on top of your daily wellness.",
    benefits: [
      "Continuous heart rate monitoring",
      "Sleep quality tracking",
      "Activity & step counting"
    ],
    image: "https://www.agatsaone.com/cdn/shop/files/ETR_Band.png?v=1700000000",
    category: "wellness",
    isExternal: true,
    link: "https://easytouchrhythm.com",
    features: [
      "Water-resistant design",
      "7-day battery life",
      "Real-time health alerts",
      "Sync with health apps"
    ]
  },
  {
    id: "zlu",
    name: "Zlu – Sleep Aid",
    tagline: "Rest Better, Naturally",
    description: "A non-invasive sleep support device that helps you achieve deeper, more restful sleep without medication.",
    benefits: [
      "No medication needed",
      "Gentle, natural sleep induction",
      "Perfect for nightly routines"
    ],
    image: "https://www.agatsaone.com/cdn/shop/files/ZluDevice.png?v=1700000000",
    category: "sleep",
    isExternal: false,
    link: "/products/zlu",
    price: "₹4,999",
    features: [
      "Clinically tested technology",
      "Silent operation",
      "Portable design",
      "USB-C rechargeable"
    ]
  },
  {
    id: "corebalance",
    name: "CoreBalance BMI",
    tagline: "Beyond Just Weight",
    description: "An advanced body composition analyzer that gives you insights beyond the scale.",
    benefits: [
      "Full body composition analysis",
      "Track muscle, fat & water",
      "Suitable for home & clinic"
    ],
    image: "https://www.agatsaone.com/cdn/shop/files/CoreBalance.png?v=1700000000",
    category: "weight",
    isExternal: false,
    link: "/products/corebalance",
    price: "₹6,999",
    features: [
      "10+ body metrics",
      "Multi-user profiles",
      "App connectivity",
      "Professional accuracy"
    ]
  }
];

export const categoryInfo = {
  heart: {
    icon: "Heart",
    title: "Heart Health",
    description: "Monitor your cardiac health with medical-grade precision"
  },
  wellness: {
    icon: "Activity",
    title: "Daily Wellness",
    description: "Track your vitals and stay on top of your health goals"
  },
  sleep: {
    icon: "Moon",
    title: "Better Sleep",
    description: "Achieve deeper, more restful sleep naturally"
  },
  weight: {
    icon: "Scale",
    title: "Body Composition",
    description: "Understand your body beyond just weight"
  }
};
