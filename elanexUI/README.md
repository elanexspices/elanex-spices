# Elanex Spices

Elanex Spices is currently a marketing and portfolio website for a cardamom
cultivator and seller.

Tech stack:

- Frontend: Vite, React, TypeScript, and TanStack Router
- Product CMS: Sanity
- WhatsApp-based contact enquiries

This project was built with [Lovable](https://lovable.dev) and uses Vite,
TanStack Router, and React.

The current release includes product discovery and enquiry pages only. Cart,
checkout, ordering, payments, shipping, and customer accounts are intentionally
deferred to a future ecommerce phase.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1bdf30a7-3df0-4821-b573-8f2c6449fa97).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

Products are read from Sanity when `VITE_SANITY_PROJECT_ID` is configured.
Copy `.env.example` to `.env` for the local defaults:

```sh
cp .env.example .env
```

For hosting, set the Sanity `VITE_*` variables in Vercel and rebuild the
frontend. Product and contact enquiries work directly from the browser; no
backend URL or secret is required.

Product enquiries open WhatsApp with a prefilled message using the public
business number. The visitor must press Send in WhatsApp. The Contact page
does the same after collecting name, email, phone number, and message. Do not
add Sanity write tokens or other private keys to frontend environment variables.
