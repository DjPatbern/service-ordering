# zhoppin.ng

A production-oriented Nigerian ecommerce storefront for verified smartphones,
laptops, solar power gear and lifestyle essentials. It uses Next.js App Router,
React, TypeScript, Tailwind CSS and MongoDB Atlas.

The supplied solar flyers are imported as **enquiry-only** products. Admin must
confirm each product's current price and stock before enabling checkout.
Customers submit their address and cart on the site, then WhatsApp opens with a
formatted order summary and their private tracking link. Admin confirms stock,
delivery and payment in the WhatsApp conversation while the tracking page keeps
the customer updated.

## Local setup

Use Node.js 22.12 or newer.

    npm ci
    cp .env.example .env.local
    npm run dev

Without MongoDB variables the public landing page and enquiry-only seed
catalogue still render, while checkout and admin explain that they are not yet
connected.

## Create the free MongoDB database

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a project named Zhoppin and deploy an **M0 Free** cluster.
3. In **Security → Database Access**, create a database user for this app.
   Choose a unique generated password and grant read/write access to the
   zhoppin database. This is separate from your Atlas website password.
4. In **Security → Network Access**, allow connections from 0.0.0.0/0.
   Vercel functions do not have one fixed outbound IP on the standard plan, so
   the database user must have a strong unique password. Do not reuse that
   password anywhere.
5. In **Database → Connect → Drivers → Node.js**, copy the connection string.
   Replace the password placeholder with the URL-encoded database-user
   password. Set it as MONGODB_URI; set MONGODB_DB=zhoppin.

Product images are resized to WebP and limited to 2 MB before storage. Monitor
Atlas storage as the catalogue grows.

## Create the admin login

Generate a password hash locally. The plain password is never stored:

    npm run admin:hash -- 'use a long unique admin password'
    openssl rand -base64 48

Add the first output as ADMIN_PASSWORD_HASH, the second as AUTH_SECRET, and set
ADMIN_EMAIL to the owner's login email. Keep all three private.

## Configure Vercel

In **Vercel → Project → Settings → Environment Variables**, add:

    NEXT_PUBLIC_SITE_URL=https://zhoppin.ng
    MONGODB_URI=mongodb+srv://...
    MONGODB_DB=zhoppin
    ADMIN_EMAIL=...
    ADMIN_PASSWORD_HASH=...
    AUTH_SECRET=...

Apply them to Production and Preview, then redeploy. Do not paste any secret
into source control or a variable prefixed with NEXT_PUBLIC_.

After deployment:

1. Visit /admin/login and sign in.
2. Open **Products** and click **Import supplied solar offers** once.
3. Review each offer. It remains enquiry-only until **Enable checkout** is
   checked and available stock is greater than zero.
4. Optionally choose one published product as **Product of the Week**.
5. Use **Categories** to add or rename categories. A category cannot be deleted
   while products still use it.
6. When a customer submits checkout, their cart, address and private tracking
   link are prepared as a WhatsApp message. Open the order in admin, confirm
   stock and enter delivery. This reserves inventory.
7. Coordinate payment in WhatsApp, verify the full credit directly in the bank
   account, then mark the order paid in admin.

## Ordering and payment flow

    Customer bag
      → address and contact details
      → formatted cart and tracking link open in WhatsApp
      → delivery quote pending
      → admin confirms delivery and reserves stock
      → customer completes the order with Zhoppin on WhatsApp
      → admin verifies actual bank credit
      → dispatch and delivery updates

Order prices are recalculated from MongoDB on the server. Client-supplied
prices are ignored. Checkout uses idempotency keys to prevent duplicate orders.
Admin sessions are signed, HTTP-only, same-site cookies backed by revocable
database sessions. Mutations validate same-origin requests and are rate
limited. Historical payment proofs remain private and require admin
authentication.

## Architecture

    app/
      page.tsx                 Brand landing page
      shop/                    Searchable catalogue and product details
      cart/ checkout/          Client bag and server-validated order request
      orders/[token]/          Private customer order tracking
      admin/                   Protected products, categories and orders
      api/                     Validated order, auth, upload and admin handlers
    features/
      store/                   Product, cart, checkout and tracking domain UI
      admin/                   Admin forms and control-room UI
    lib/server/
      db.ts                    Cached MongoDB connection and indexes
      catalog.ts               Product repository and seed import
      orders.ts                Pricing, state transitions and stock reservation
      auth.ts                  Signed, revocable admin sessions
      uploads.ts               Image validation, resize and private storage

Server Components read catalogue and admin data directly through repositories.
Small Client Components own the bag and forms. MongoDB stores product, order,
session, rate-limit and media records.

## Product and payment caveats

- Supplied flyer claims, older contact numbers, pricing, warranty language,
  instalment language and runtime estimates are treated as reference material.
  Confirm current details before enabling checkout.
- Delivery is not estimated automatically. Admin quotes it for each address.
- The website never marks a payment paid from a receipt alone.
- The private order URL acts as a bearer credential. Customers are told to
  keep it private.
- WhatsApp deep links prefill the order message but the customer must press send
  in WhatsApp. Browsers cannot automatically attach files or send messages.

## Verification

    npm run check
    npm run build
    npx playwright install chromium
    npm run test:e2e

npm run check runs lint, Next.js route type generation, strict TypeScript, unit
tests and formatting checks.
