import {defineField, defineType} from "sanity";

export const qualityGroups = [
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
      name: "qualityGroups",
      title: "Quality groups",
      type: "array",
      description: "Select every quality section where this product is available.",
      of: [{type: "string"}],
      options: {list: qualityGroups, layout: "checkbox"},
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "qualityPrices",
      title: "Prices by quality group (INR / kg)",
      type: "object",
      fields: [
        defineField({
          name: "export",
          title: "Export Quality price",
          type: "number",
          validation: (rule) => rule.min(0.01),
          hidden: ({document}) => !document?.qualityGroups?.includes("export"),
        }),
        defineField({
          name: "domestic",
          title: "Domestic Quality price",
          type: "number",
          validation: (rule) => rule.min(0.01),
          hidden: ({document}) => !document?.qualityGroups?.includes("domestic"),
        }),
        defineField({
          name: "rejection",
          title: "Rejection / Mix price",
          type: "number",
          validation: (rule) => rule.min(0.01),
          hidden: ({document}) => !document?.qualityGroups?.includes("rejection"),
        }),
      ],
      validation: (rule) => rule.custom((prices, context) => {
        const selected = context.document?.qualityGroups ?? [];
        return selected.every((group) => prices?.[group])
          ? true
          : "Add a price for every selected quality group.";
      }),
    }),
    defineField({
      name: "qualityImages",
      title: "Images by quality group (optional)",
      type: "object",
      description: "Leave a category image empty to use the common product image.",
      fields: [
        defineField({name: "export", title: "Export Quality image", type: "image", options: {hotspot: true}}),
        defineField({name: "domestic", title: "Domestic Quality image", type: "image", options: {hotspot: true}}),
        defineField({name: "rejection", title: "Rejection / Mix image", type: "image", options: {hotspot: true}}),
      ],
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
