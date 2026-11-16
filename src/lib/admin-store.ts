/** Browser-only storage for the admin panel (no server needed). */

export type ContactInfo = {
  doctor: string;
  title: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  facebook: string;
};
export type Service = { id: string; name: string; description: string };
export type Faq = { id: string; question: string; answer: string };
export type AppointmentRequest = {
  id: string;
  name: string;
  phone: string;
  date: string;
  message: string;
  page: string;
  createdAt: number;
  read: boolean;
};
export type Account = { username: string; password: string };

export const KEYS = {
  contact: "site_admin_contact_v1",
  services: "site_admin_services_v1",
  faqs: "site_admin_faqs_v1",
  requests: "site_admin_requests_v1",
  account: "site_admin_account_v1",
} as const;

export const DEFAULT_CONTACT: ContactInfo = {
  doctor: "Dr. Bilal Farhat Ali, MD",
  title: "Internal Medicine Physician",
  phone: "",
  whatsapp: "",
  email: "",
  address: "Mercy Health – Anderson Hospital, 7500 State Rd, Cincinnati, OH 45255",
  hours: "By appointment",
  instagram: "https://www.instagram.com/dr.bilalfarhat/",
  facebook: "",
};

const SERVICE_NAMES = [
  "Diabetes Management",
  "Blood Pressure & Heart Health",
  "Kidney Health (CKD)",
  "Preventive Check-ups",
  "Thyroid & Hormone Disorders",
  "Cholesterol & Lipid Management",
  "Lung & Breathing Care",
  "Lab Tests & Diagnostics",
  "Weight & Lifestyle Medicine",
  "Digestive & Liver Health",
  "Infections & Acute Illness",
  "Telehealth Consultations",
];
export const DEFAULT_SERVICES: Service[] = SERVICE_NAMES.map((name, i) => ({
  id: `s${i + 1}`,
  name,
  description: "",
}));

export const DEFAULT_FAQS: Faq[] = [
  {
    id: "f1",
    question: "How do I book a consultation with Dr. Bilal Farhat Ali?",
    answer: "Fill in the appointment form or message Dr. Bilal on Instagram @dr.bilalfarhat and we will confirm a time.",
  },
  {
    id: "f2",
    question: "What happens during the first consultation?",
    answer: "The doctor takes your full history, examines you, reviews your reports and explains a clear care plan.",
  },
  {
    id: "f3",
    question: "Can I consult in Urdu?",
    answer: "Yes. Dr. Bilal consults in both English and Urdu.",
  },
];

export const DEFAULT_ACCOUNT: Account = { username: "admin", password: "admin123" };

export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}
