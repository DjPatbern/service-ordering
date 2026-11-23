import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/brand";
import { getProducts } from "@/lib/server/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...products.map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [new URL(product.image, siteUrl).toString()],
    })),
  ];
}
