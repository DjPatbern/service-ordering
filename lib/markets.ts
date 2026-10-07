export const markets = {
  ng: {
    name: "Nigeria",
    flag: "🇳🇬",
    currency: "NGN",
    locale: "en-NG",
    taxRate: 0.075,
    headline: "Made for your next big move.",
    description:
      "From a fresh idea in Lagos to a brand loved everywhere. Discover thoughtful design, print and gifts, all in one place.",
  },
  us: {
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
    locale: "en-US",
    taxRate: 0.08,
    headline: "Build a brand that goes places.",
    description:
      "For big launches, small businesses and everything in between. Bring your brand to life with creative services made for the USA.",
  },
  uk: {
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
    locale: "en-GB",
    taxRate: 0.2,
    headline: "A little character. A lasting impression.",
    description:
      "Distinctive design, considered gifts and beautifully finished print. Everything you need to make your mark across the UK.",
  },
  ca: {
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD",
    locale: "en-CA",
    taxRate: 0.13,
    headline: "Good ideas deserve great branding.",
    description:
      "From your first launch to your next chapter. Discover creative services, memorable gifts and quality print for Canadian brands.",
  },
} as const;
export type Market = keyof typeof markets;
export const marketCodes = Object.keys(markets) as Market[];
export function isMarket(value: string): value is Market {
  return Object.hasOwn(markets, value);
}
export function money(minor: number, market: Market) {
  return new Intl.NumberFormat(markets[market].locale, {
    style: "currency",
    currency: markets[market].currency,
    maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
  }).format(minor / 100);
}
