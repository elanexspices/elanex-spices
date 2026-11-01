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
      name: "priceTiers",
      title: "Price list",
      type: "array",
      description: "Optional grade-based prices shown on the product page.",
      of: [
        {
          type: "object",
          name: "priceTier",
          title: "Quality tier",
          fields: [
            defineField({
              name: "title",
              title: "Section title",
              type: "string",
              options: {
                list: [
                  {title: "Export Quality", value: "Export Quality"},
                  {title: "Domestic Quality", value: "Domestic Quality"},
                  {title: "Rejection / Mix", value: "Rejection / Mix"},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
              description: "For example: Premium quality for global market.",
            }),
            defineField({
              name: "rows",
              title: "Grade prices",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "priceRow",
                  title: "Grade price",
                  fields: [
                    defineField({
                      name: "grade",
                      title: "Grade / size",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "price",
                      title: "Price (₹ / kg)",
                      type: "number",
                      validation: (rule) => rule.required().min(0.01),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "grade",
                      subtitle: "price",
                    },
                    prepare({title, subtitle}) {
                      return {
                        title,
                        subtitle: subtitle ? `₹${subtitle} / kg` : "",
                      };
                    },
                  },
                },
              ],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "subtitle",
            },
          },
        },
      ],
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
      subtitle: "category",
      media: "image",
    },
  },
});
