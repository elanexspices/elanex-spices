import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error(
    "Set SANITY_PROJECT_ID and SANITY_API_TOKEN before seeding flyer products.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const products = [
  ["export", "8.5 mm Bold", 3960],
  ["export", "8 mm Bold", 3660],
  ["export", "7 mm+ Bold", 3400],
  ["export", "7 - 8 mm", 3240],
  ["export", "6 - 8 mm", 3160],
  ["export", "6 - 7 mm", 2940],
  ["export", "6 mm Bold (or Bulk)", 3240],
  ["export", "5 - 6 mm", 2690],
  ["domestic", "8.5 mm Bold", 3880],
  ["domestic", "8 mm Bold", 3580],
  ["domestic", "7 mm+ Bold", 3320],
  ["domestic", "7 - 8 mm", 3160],
  ["domestic", "6 - 8 mm", 3080],
  ["domestic", "6 - 7 mm", 2860],
  ["domestic", "6 mm Bold (or Bulk)", 3160],
  ["domestic", "5 - 6 mm", 2610],
  ["rejection", "8 mm (Rejection)", 2920],
  ["rejection", "7 - 8 mm (Rejection)", 2830],
  ["rejection", "Bulk Rejection", 2830],
];

const groupTitles = {
  export: "Export Quality",
  domestic: "Domestic Quality",
  rejection: "Rejection / Mix",
};

const transaction = client.transaction();

for (const [qualityGroup, name, price] of products) {
  const slug = `${qualityGroup}-${name}`
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const sortOrder = products.findIndex(
    ([group, productName]) => group === qualityGroup && productName === name,
  );

  transaction.createOrReplace({
    _id: `flyer-${slug}`,
    _type: "product",
    name,
    slug: { _type: "slug", current: slug },
    description: `${groupTitles[qualityGroup]} grade from the Elanex Spices daily price list.`,
    price,
    qualityGroup,
    category: "cardamom",
    sortOrder,
    available: false,
  });
}

await transaction.commit();
console.log(
  `Created or updated ${products.length} flyer products as hidden records.`,
);
console.log(
  "Add an image to each record and enable “Show on website” after reviewing them.",
);
