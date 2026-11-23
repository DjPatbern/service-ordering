export const brand = {
  name: "zhoppin.ng",
  description:
    "Verified tech. Reliable power. Everyday essentials. Shop smarter with transparent pricing and nationwide delivery across Nigeria.",
  phone: "08133872007",
  internationalPhone: "+2348133872007",
  whatsapp: "https://wa.me/2348133872007",
  whatsappQR: "https://wa.me/qr/THUJ6ZFPPC33P1?s=r",
  channel: "https://whatsapp.com/channel/0029VbE1iDBHFxP34PrlGI16",
  tiktok: "https://www.tiktok.com/@zhoppin.ng",
  facebook: "https://www.facebook.com/share/1A6WwjWjcN/?mibextid=wwXIfr",
  bank: {
    name: "Fidelity Bank",
    accountName: "ISAAC BENNETT PETERS",
    accountNumber: "6321689354",
  },
} as const;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zhoppin.ng";
export function naira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: kobo % 100 ? 2 : 0,
  }).format(kobo / 100);
}
export function whatsappFor(message: string) {
  return `${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}
