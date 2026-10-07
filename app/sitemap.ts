import type { MetadataRoute } from "next";
import { marketCodes, markets } from "@/lib/markets";
import { services } from "@/features/catalog/data";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return marketCodes.flatMap((market) => [
    {
      url: `${base}/${market}`,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...services.map((service) => ({
      url: `${base}/${market}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          marketCodes.map((code) => [
            markets[code].locale,
            `${base}/${code}/services/${service.slug}`,
          ]),
        ),
      },
    })),
  ]);
}
