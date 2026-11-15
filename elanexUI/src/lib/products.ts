import { createClient } from "@sanity/client";

export type QualityGroup = "export" | "domestic" | "rejection";
type SanityProduct = {
  id: string;
  name: string;
  description: string | null;
  category: "cardamom" | "seeds";
  image: string;
  qualityGroups?: QualityGroup[];
  qualityPrices?: Partial<Record<QualityGroup, number>>;
  qualityImages?: Partial<Record<QualityGroup, string>>;
  legacyQualityPricing?: Array<{qualityGroup: QualityGroup; price: number; image: string}>;
  price?: number;
  qualityGroup?: QualityGroup;
};
export type Product = {
  id: string;
  name: string;
  description: string | null;
  category: "cardamom" | "seeds";
  qualityGroup: QualityGroup;
  price: number;
  image: string;
};
export let products: Product[] = [];
export const money = (amount: number) => "₹" + amount.toLocaleString("en-IN");
const WHATSAPP_NUMBER = "918921263343";
export const whatsappContactUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I would like to enquire about Elanex Spices.")}`;
export const whatsappEnquiryUrl = (productName: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello, I would like to enquire about this product: ${productName}.`)}`;
export const whatsappContactFormUrl = (payload: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello, I would like to enquire about Elanex Spices.\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nMessage: ${payload.message}`,
  )}`;
export function metadata(title: string, description: string) {
  const pageTitle = title === "Elanex Spices" ? title : `Elanex Spices | ${title}`;
  return {
    meta: [
      {title: pageTitle},
      {name: "description", content: description},
      {property: "og:title", content: pageTitle},
      {property: "og:description", content: description},
      {property: "og:type", content: "website"},
      {name: "twitter:card", content: "summary_large_image"},
    ],
  };
}

const SANITY_PROJECT_ID = import.meta.env["VITE_SANITY_PROJECT_ID"];
const SANITY_DATASET = import.meta.env["VITE_SANITY_DATASET"] ?? "production";
const SANITY_API_VERSION = import.meta.env["VITE_SANITY_API_VERSION"] ?? "2025-01-01";
const sanityClient = SANITY_PROJECT_ID
  ? createClient({projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, apiVersion: SANITY_API_VERSION, useCdn: true})
  : null;

const PRODUCTS_QUERY = `*[
  _type == "product" &&
  defined(slug.current) &&
  available != false
] | order(coalesce(sortOrder, 9999) asc, _createdAt asc) {
  "id": slug.current,
  name,
  description,
  category,
  "image": image.asset->url,
  qualityGroups,
  qualityPrices,
  "qualityImages": {
    "export": qualityImages.export.asset->url,
    "domestic": qualityImages.domestic.asset->url,
    "rejection": qualityImages.rejection.asset->url
  },
  "legacyQualityPricing": qualityPricing[]{
    qualityGroup,
    price,
    "image": coalesce(image.asset->url, ^.image.asset->url)
  },
  price,
  qualityGroup
}`;

let productsRequest: Promise<Product[]> | null = null;

function expandProducts(records: SanityProduct[]): Product[] {
  return records.flatMap((record) => {
    const groups = record.qualityGroups
      ?? record.legacyQualityPricing?.map((entry) => entry.qualityGroup)
      ?? [record.qualityGroup ?? "export"];
    return groups.flatMap((group) => {
      const price = record.qualityPrices?.[group]
        ?? record.legacyQualityPricing?.find((entry) => entry.qualityGroup === group)?.price
        ?? record.price;
      if (typeof price !== "number") {
        console.error(`Product "${record.id}" is missing a price for the ${group} quality group.`);
        return [];
      }
      return [{
        id: `${record.id}__${group}`,
        name: record.name,
        description: record.description,
        category: record.category,
        image: record.qualityImages?.[group]
          ?? record.legacyQualityPricing?.find((entry) => entry.qualityGroup === group)?.image
          ?? record.image,
        qualityGroup: group,
        price,
      }];
    });
  });
}

function fetchProductsFromSanity(): Promise<Product[]> {
  if (!sanityClient) return Promise.reject(new Error("Sanity is not configured."));
  return sanityClient.fetch<SanityProduct[]>(PRODUCTS_QUERY).then(expandProducts);
}

export function fetchProducts(): Promise<Product[]> {
  if (!productsRequest) {
    productsRequest = (sanityClient
      ? fetchProductsFromSanity()
      : Promise.reject(new Error("Sanity is not configured.")))
      .then((data) => {
        products = data;
        return data;
      })
      .finally(() => {
        productsRequest = null;
      });
  }
  return productsRequest;
}
