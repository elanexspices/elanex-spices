import {defineField, defineType} from "sanity";

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
      options: {
        source: "name",
        maxLength: 180,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "price",
      title: "Indicative price (INR)",
      type: "number",
      validation: (rule) => rule.required().min(0.01),
    }),
    defineField({
      name: "qualityGroup",
      title: "Quality group",
      type: "string",
      description: "Controls which quality section shows this product.",
      options: {
        list: [
          {title: "Export Quality", value: "export"},
          {title: "Domestic Quality", value: "domestic"},
          {title: "Rejection / Mix", value: "rejection"},
        ],
        layout: "radio",
      },
      initialValue: "export",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Product image",
      type: "image",
      options: {
        hotspot: true,
      },
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
    select: {
      title: "name",
      subtitle: "qualityGroup",
      media: "image",
    },
  },
});
