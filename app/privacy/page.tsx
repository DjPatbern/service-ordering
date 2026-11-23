import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy and order terms",
  description: "How Zhoppin handles customer details, orders and payments.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="page-shell max-w-4xl py-14">
      <p className="eyebrow">Clear from the start</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">
        Privacy and order terms
      </h1>
      <p className="mt-4 text-sm text-muted">Last updated 23 November 2026</p>
      <div className="mt-9 space-y-9 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-xl font-bold text-ink">What we collect</h2>
          <p className="mt-3">
            When you request an order, we collect your name, phone number, email
            address, delivery address, selected products and any note you
            provide. If you pay by transfer, we also collect the payer name,
            transaction reference and the receipt image you upload.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-ink">How we use it</h2>
          <p className="mt-3">
            We use these details to confirm stock and delivery costs, verify
            payment, fulfil your order, provide delivery updates, prevent abuse
            and handle support. We do not sell your personal information.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-ink">Payment and delivery</h2>
          <p className="mt-3">
            Product prices are shown in naira. Delivery is quoted after we
            receive your address. Do not transfer money until your private order
            page shows the confirmed total and bank details. Uploading a receipt
            does not prove payment: an administrator must verify the credit in
            the stated bank account. Delivery begins only after that
            verification.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-ink">Product information</h2>
          <p className="mt-3">
            Promotional flyers are reference materials and may include older
            offers, phone numbers, specifications or instalment language.
            Details shown in the current website checkout and confirmed by our
            team govern your order. Ask us to confirm specifications, warranty
            scope and compatibility before paying.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-ink">Storage and access</h2>
          <p className="mt-3">
            Order records are stored in our private database. Payment proofs are
            available only to signed-in administrators. Your private order link
            acts like a password, so keep it confidential. We retain records
            only as long as reasonably needed for fulfilment, accounting,
            support, fraud prevention and legal obligations.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-ink">Questions and requests</h2>
          <p className="mt-3">
            Contact us on WhatsApp at{" "}
            <a className="font-semibold text-brand" href={brand.whatsapp}>
              {brand.phone}
            </a>{" "}
            to ask about your information, correct order details or request
            deletion where record-keeping obligations allow it.
          </p>
        </section>
      </div>
    </main>
  );
}
