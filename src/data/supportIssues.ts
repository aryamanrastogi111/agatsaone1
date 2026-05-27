// Support issue catalog — accurate per product.
// IMPORTANT terminology:
//   - Never use "glucose"; use "sugar reading / sugar response".
//   - EasyTouch Wellness = light-based OPTICAL finger sensor (15s scan, NO strips,
//     NO needles, NO blood, NO lancets). Pairs with the Agatsa One app.
//   - EasyTouch Rhythm = rhythm sensor, NEVER described as ECG.
//   - SanketLife = the ECG device.

export type Priority = "low" | "medium" | "high" | "urgent";

export interface SupportIssue {
  id: string;
  title: string;
  priority: Priority;
  /** Self-help steps presented as a checklist. Each becomes a "Yes/No/Skip" item. */
  questionnaire: string[];
  /** Final hint shown above the ticket form if none of the steps worked. */
  hint?: string;
}

export interface SupportCategory {
  id: string;
  label: string;
  blurb: string;
  issues: SupportIssue[];
}

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: "easytouch-wellness",
    label: "EasyTouch Wellness",
    blurb:
      "Light-based optical finger sensor · 15-second scan · pairs with the Agatsa One app",
    issues: [
      {
        id: "etw-not-powering-on",
        title: "Device won't power on or won't charge",
        priority: "high",
        questionnaire: [
          "Have you charged the device for at least 30 minutes with the supplied cable?",
          "Have you tried a different USB port or charger (5V output)?",
          "Does the indicator light blink or stay steady when plugged in?",
          "Have you tried holding the power button for 10 seconds to force-restart?",
        ],
        hint: "If the indicator stays off after 30 minutes on charge, please attach a short video.",
      },
      {
        id: "etw-bluetooth-pairing",
        title: "Bluetooth pairing with Agatsa One app fails",
        priority: "medium",
        questionnaire: [
          "Is Bluetooth turned on in your phone settings?",
          "Have you granted the Agatsa One app Bluetooth and Location permissions?",
          "Is the device unpaired from any other phone it was previously connected to?",
          "Have you closed the app fully and reopened it next to the powered-on device?",
        ],
        hint: "Tell us your phone model and OS version (Android 14 / iOS 17 etc.) so we can help faster.",
      },
      {
        id: "etw-scan-not-completing",
        title: "Scan doesn't complete in 15s / 'finger not detected'",
        priority: "medium",
        questionnaire: [
          "Is the sensor window clean and dry? (Wipe gently with a soft dry cloth.)",
          "Is your finger placed flat, fully covering the sensor, with light pressure?",
          "Did you keep your hand still for the full 15 seconds?",
          "Are your fingers warm? (Cold fingers reduce light signal — rub your hands together first.)",
        ],
      },
      {
        id: "etw-reading-off",
        title: "My reading seems off or inconsistent",
        priority: "medium",
        questionnaire: [
          "Did you scan while seated and relaxed, not immediately after exercise?",
          "Was the same finger used (ideally the index finger of your non-dominant hand)?",
          "Did you take 2–3 back-to-back scans to compare?",
          "Have you logged your scans for a few days so trends are visible in the app?",
        ],
        hint: "EasyTouch Wellness is a daily companion — single readings can vary; trends matter most.",
      },
      {
        id: "etw-trend-not-showing",
        title: "Sugar-response trend / vitals not showing in app",
        priority: "medium",
        questionnaire: [
          "Did the scan complete with a green confirmation?",
          "Is your phone connected to the internet right after scanning?",
          "Have you pulled-to-refresh the home screen of Agatsa One?",
          "Are you logged in with the same account you used during setup?",
        ],
      },
      {
        id: "etw-meal-snap",
        title: "Meal-snap / HbA1c prediction not generating",
        priority: "low",
        questionnaire: [
          "Is the photo well-lit and showing the food clearly?",
          "Are you on the latest version of the Agatsa One app?",
          "Have you taken at least a few scans before today (the model needs your baseline)?",
        ],
      },
      {
        id: "etw-sensor-damage",
        title: "Light/sensor window looks dirty, scratched or damaged",
        priority: "high",
        questionnaire: [
          "Did you try wiping the sensor with a dry microfibre cloth?",
          "Is there visible physical damage (crack, deep scratch)?",
        ],
        hint: "If damaged within warranty, please attach a clear photo of the sensor.",
      },
      {
        id: "etw-not-a-glucometer",
        title: "How do I interpret my daily reading?",
        priority: "low",
        questionnaire: [
          "Have you read the 'How it works' section inside the Agatsa One app?",
        ],
        hint: "EasyTouch Wellness is NOT a glucometer — it reads optical signals to show your daily sugar-response trend. We'll send you a short explainer.",
      },
      {
        id: "etw-nera-ai-not-active",
        title: "My 1-year free Nera AI is not activated",
        priority: "medium",
        questionnaire: [
          "Did you complete account setup using the email used at checkout?",
          "Did you scan the activation QR / enter the activation code from the box?",
          "Has it been more than 24 hours since your order was delivered?",
        ],
        hint: "Share your order number — we'll activate it manually from our end.",
      },
    ],
  },
  {
    id: "sanketlife-ecg",
    label: "SanketLife ECG",
    blurb: "12-lead-comparable pocket ECG · pairs with the Agatsa One app",
    issues: [
      {
        id: "sl-not-on",
        title: "Device not turning on / not charging",
        priority: "high",
        questionnaire: [
          "Charged for at least 30 minutes with the supplied cable?",
          "Does the indicator light respond when plugged in?",
          "Have you held the power button for 10 seconds to force-restart?",
        ],
      },
      {
        id: "sl-ecg-not-generating",
        title: "ECG report is not generating",
        priority: "high",
        questionnaire: [
          "Are all 3 electrodes (both thumbs + left knee) in clean, firm contact?",
          "Are your hands and the electrodes dry?",
          "Did you stay still for the full recording (no talking, no movement)?",
          "Is the device fully paired in the Agatsa One app before you start?",
        ],
      },
      {
        id: "sl-bluetooth",
        title: "Bluetooth pairing fails",
        priority: "medium",
        questionnaire: [
          "Bluetooth and Location permissions granted to Agatsa One?",
          "Device unpaired from any other phone previously used?",
          "Have you closed and reopened the app next to the powered-on device?",
        ],
      },
      {
        id: "sl-electrode-error",
        title: "'Electrode contact' / poor signal error",
        priority: "medium",
        questionnaire: [
          "Are the electrodes clean? (Wipe with a slightly damp cloth, then dry.)",
          "Are your skin contact points clean and slightly moist?",
          "Are you holding the device firmly with thumbs covering the metal pads fully?",
        ],
      },
      {
        id: "sl-app-sync",
        title: "App sync failed / readings missing in app",
        priority: "medium",
        questionnaire: [
          "Is your phone on the internet right after recording?",
          "Are you logged in with the same account as the device?",
          "Pulled-to-refresh on the app home screen?",
        ],
      },
      {
        id: "sl-pdf-missing",
        title: "PDF report not generating / can't be shared",
        priority: "low",
        questionnaire: [
          "Did the recording show as 'complete' in the app?",
          "Have you tried the 'Share PDF' option from the recording detail screen?",
        ],
      },
      {
        id: "sl-battery",
        title: "Battery drains very fast",
        priority: "medium",
        questionnaire: [
          "Is the device fully turned off (not just idle) between uses?",
          "Did you charge it for the full recommended duration when new?",
        ],
      },
      {
        id: "sl-accuracy",
        title: "I have doubts about my ECG reading",
        priority: "high",
        questionnaire: [
          "Did you record while seated, calm, and still?",
          "Did you take 2 readings back-to-back to compare?",
        ],
        hint: "Please share the PDF report via the ticket so our team can review it.",
      },
    ],
  },
  {
    id: "easytouch-rhythm",
    label: "EasyTouch Rhythm",
    blurb: "Rhythm sensor for daily heart-rhythm monitoring (not an ECG device)",
    issues: [
      {
        id: "etr-not-detected",
        title: "Rhythm not being detected",
        priority: "medium",
        questionnaire: [
          "Is the device snug against the skin per the placement guide?",
          "Is your skin dry and not covered by clothing/lotion at the contact area?",
          "Did you stay still during the reading?",
        ],
      },
      {
        id: "etr-irregular",
        title: "I got an 'irregular rhythm' alert — what does it mean?",
        priority: "high",
        questionnaire: [
          "Have you read the in-app explanation for the rhythm category shown?",
          "Have you taken 2–3 more readings while seated and calm?",
        ],
        hint: "Rhythm alerts are a daily wellness signal — for diagnosis please consult a doctor.",
      },
      {
        id: "etr-pairing",
        title: "App pairing fails",
        priority: "medium",
        questionnaire: [
          "Bluetooth and Location permissions granted to Agatsa One?",
          "Device unpaired from any previous phone?",
        ],
      },
      {
        id: "etr-placement",
        title: "I'm not sure where to place the sensor",
        priority: "low",
        questionnaire: [
          "Have you opened the 'Placement guide' in the Agatsa One app?",
        ],
      },
    ],
  },
  {
    id: "smart-scale",
    label: "Smart Scale",
    blurb: "Body composition scale with multi-user support",
    issues: [
      {
        id: "ss-weight-inconsistent",
        title: "Weight reading is inconsistent between scans",
        priority: "medium",
        questionnaire: [
          "Is the scale on a hard, flat surface (not carpet)?",
          "Are you barefoot and standing still until the reading locks?",
          "Did you weigh at the same time of day for a fair comparison?",
        ],
      },
      {
        id: "ss-body-comp-missing",
        title: "Body composition (fat %, water, etc.) not showing",
        priority: "medium",
        questionnaire: [
          "Are you barefoot with dry feet covering all 4 electrodes on the scale?",
          "Have you completed your profile (age, height, sex) in the app?",
        ],
      },
      {
        id: "ss-wifi-bt",
        title: "Wi-Fi / Bluetooth not connecting",
        priority: "medium",
        questionnaire: [
          "Is your Wi-Fi 2.4 GHz (most smart scales don't support 5 GHz)?",
          "Did you grant the app Bluetooth and Location permissions?",
        ],
      },
      {
        id: "ss-multi-user",
        title: "Scale not auto-switching between family members",
        priority: "low",
        questionnaire: [
          "Are all users' profiles set up with distinct weight ranges in the app?",
        ],
      },
    ],
  },
  {
    id: "nera-ai",
    label: "Nera AI / Agatsa One App",
    blurb: "The Agatsa One app + your 1-year free Nera AI insights",
    issues: [
      {
        id: "app-otp",
        title: "Login OTP is not arriving",
        priority: "high",
        questionnaire: [
          "Have you waited 60 seconds and used the 'Resend OTP' option?",
          "Have you checked your SMS spam / promotions folder?",
          "Is the phone number entered correct with country code?",
        ],
      },
      {
        id: "app-nera-not-applied",
        title: "1-year free Nera AI not applied to my account",
        priority: "medium",
        questionnaire: [
          "Did you sign up with the email used at checkout?",
          "Has it been more than 24 hours since your device was delivered?",
        ],
        hint: "Share your order number — we'll activate it manually.",
      },
      {
        id: "app-data-sync",
        title: "Readings not syncing to my account",
        priority: "medium",
        questionnaire: [
          "Is the phone on the internet?",
          "Are you logged in with the same account everywhere?",
        ],
      },
      {
        id: "app-report-interpret",
        title: "I don't understand my Nera AI report",
        priority: "low",
        questionnaire: [
          "Have you tapped each metric to read the in-app explanation?",
        ],
        hint: "We'll send you a plain-English walkthrough.",
      },
      {
        id: "app-account-deletion",
        title: "I want to delete my account / data",
        priority: "medium",
        questionnaire: [],
        hint: "Account and data deletion is processed within 30 days via info@agatsa.com.",
      },
    ],
  },
  {
    id: "orders-shipping",
    label: "Orders & Shipping",
    blurb: "Order tracking, delivery, packaging issues",
    issues: [
      {
        id: "os-not-received",
        title: "My order hasn't arrived",
        priority: "high",
        questionnaire: [
          "Have you checked the tracking link sent over email/SMS?",
          "Has it been more than 5 working days since the order was placed?",
        ],
      },
      {
        id: "os-wrong-item",
        title: "I received the wrong item",
        priority: "high",
        questionnaire: [
          "Can you attach a photo of what you received vs the box label?",
        ],
      },
      {
        id: "os-tracking",
        title: "Tracking link is not updating",
        priority: "medium",
        questionnaire: [
          "Has the tracking shown any update in the last 48 hours?",
        ],
      },
      {
        id: "os-damaged",
        title: "My package arrived damaged",
        priority: "urgent",
        questionnaire: [
          "Can you attach photos of the outer packaging and the product?",
        ],
        hint: "Please report damage within 48 hours of delivery.",
      },
      {
        id: "os-invoice-gst",
        title: "Invoice / GST query",
        priority: "low",
        questionnaire: [
          "Do you need a fresh copy of the invoice, or a GSTIN added/corrected?",
        ],
      },
    ],
  },
  {
    id: "returns-refunds",
    label: "Returns & Refunds",
    blurb: "Return pickup, refund status, replacements",
    issues: [
      {
        id: "rr-pickup",
        title: "I want to request a return pickup",
        priority: "medium",
        questionnaire: [
          "Is the device unused and in the original packaging?",
          "Has it been less than 7 days since delivery?",
        ],
      },
      {
        id: "rr-refund-status",
        title: "Where is my refund?",
        priority: "high",
        questionnaire: [
          "Has it been more than 7 working days since the return was picked up?",
        ],
      },
      {
        id: "rr-replacement",
        title: "I need a replacement for a defective unit",
        priority: "high",
        questionnaire: [
          "Can you attach a short video showing the issue?",
        ],
      },
    ],
  },
  {
    id: "billing",
    label: "Billing & Payments",
    blurb: "Payment failures, coupons, EMI",
    issues: [
      {
        id: "b-payment-failed-deducted",
        title: "Payment failed but money was deducted",
        priority: "urgent",
        questionnaire: [
          "Did you receive an order confirmation email?",
          "Has your bank shown the transaction as successful or pending?",
        ],
        hint: "Failed-payment refunds are auto-released by the bank within 5–7 working days.",
      },
      {
        id: "b-coupon",
        title: "Coupon code is not working",
        priority: "low",
        questionnaire: [
          "Have you checked the expiry date and minimum order value of the coupon?",
        ],
      },
      {
        id: "b-emi",
        title: "EMI question",
        priority: "low",
        questionnaire: [
          "Have you checked which banks/cards support EMI on the checkout page?",
        ],
      },
    ],
  },
  {
    id: "b2b",
    label: "Doctors / Hospitals / Corporates",
    blurb: "Bulk pricing, demos, integrations",
    issues: [
      {
        id: "b2b-bulk",
        title: "Bulk / B2B pricing enquiry",
        priority: "medium",
        questionnaire: [],
        hint: "Share your organisation name and approximate quantity.",
      },
      {
        id: "b2b-demo",
        title: "Request a demo",
        priority: "medium",
        questionnaire: [],
      },
      {
        id: "b2b-integration",
        title: "Integration / API enquiry",
        priority: "low",
        questionnaire: [],
      },
    ],
  },
  {
    id: "other",
    label: "Something else",
    blurb: "Anything not covered above",
    issues: [
      {
        id: "other-general",
        title: "General question",
        priority: "low",
        questionnaire: [],
      },
    ],
  },
];

export function findCategoryAndIssue(catId: string, issueId: string) {
  const category = SUPPORT_CATEGORIES.find((c) => c.id === catId);
  const issue = category?.issues.find((i) => i.id === issueId);
  return { category, issue };
}
