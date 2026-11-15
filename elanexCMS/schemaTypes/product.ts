import {defineField, defineType} from "sanity";

const qualityGroups = [
  {title: "Export Quality", value: "export"},
  {title: "Domestic Quality", value: "domestic"},
  {title: "Rejection / Mix", value: "rejection"},
];

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(160),
    }),
    defineField({
      name: "slug",
      title: "Product URL ID",
      type: "slug",
      options: {source: "name", maxLength: 180},
      validation: (rule) => rule.required(),
    }),
    defineField({name: "description", title: "Description", type: "text", rows: 4}),
    defineField({
      name: "qualityPricing",
      title: "Quality pricing",
      type: "array",
      description: "Add one row for every quality section where this product is sold.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "qualityGroup",
              title: "Quality group",
              type: "string",
              options: {list: qualityGroups, layout: "radio"},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price (INR / kg)",
              type: "number",
              validation: (rule) => rule.required().min(0.01),
            }),
            defineField({
              name: "image",
              title: "Category-specific image (optional)",
              type: "image",
              description: "Leave empty to use the common product image.",
              options: {hotspot: true},
            }),
          ],
          preview: {
            select: {title: "qualityGroup", subtitle: "price", media: "image"},
            prepare: ({title, subtitle, media}) => ({
              title: qualityGroups.find((group) => group.value === title)?.title ?? title,
              subtitle: subtitle ? `₹${subtitle} / kg` : "Price not set",
              media,
            }),
          },
        },
      ],
      validation: (rule) =>
        rule.required().min(1).custom((rows) => {
          if (!rows) return true;
          const groups = rows.map((row) => row.qualityGroup).filter(Boolean);
          return new Set(groups).size === groups.length
            ? true
            : "Each quality group can be added only once.";
        }),
    }),
    defineField({
      name: "image",
      title: "Common product image",
      type: "image",
      description: "Used for every quality row without its own image.",
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          {title: "Cardamom", value: "cardamom"},
          {title: "Seeds", value: "seeds"},
        ],
        layout: "radio",
      },
      initialValue: "cardamom",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first. Leave empty to place this product last.",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "available",
      title: "Show on website",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: "name", media: "image"},
    prepare: ({title, media}) => ({title, subtitle: "Product with quality pricing", media}),
  },
});
