import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Truck,
  MessageCircle,
  Smartphone,
  Laptop,
  Zap,
  Headphones,
  Phone,
  PackageCheck,
} from "lucide-react";
import { brand, naira } from "@/lib/brand";
import { getProducts } from "@/lib/server/catalog";
import { ProductCard } from "@/features/store/product-card";
import { buttonVariants } from "@/components/ui/button";
export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const products = await getProducts();
  const weekly = products.find((product) => product.featured);
  return (
    <main id="main-content">
      <section className="overflow-hidden bg-[#faf7f5]">
        <div className="page-shell grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-17">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#edcdd5] bg-[#fff0f3] px-3 py-2 text-[10px] font-semibold tracking-wide text-brand">
              <span className="size-1.5 rounded-full bg-brand" />
              SMART CHOICES. EVERYDAY WINS.
            </div>
            <h1 className="text-[clamp(2.8rem,5.3vw,4.8rem)] leading-[1.06] font-extrabold tracking-[-2.5px]">
              Your next
              <br />
              upgrade starts
              <br />
              <span className="text-brand">right here.</span>
            </h1>
            <p className="mt-6 max-w-105 text-sm leading-7 text-muted sm:text-base">
              Verified smartphones, laptops, dependable solar power and everyday
              essentials. Fair prices. Real people. Delivered across Nigeria.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className={buttonVariants({ className: "min-h-12 px-6" })}
              >
                Explore the store
                <ArrowUpRight size={17} />
              </Link>
              <a
                href={brand.whatsapp}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "secondary",
                  className: "min-h-12",
                })}
              >
                <MessageCircle size={17} />
                Talk to us
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-brand" />
                Transparent pricing
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-brand" />
                Personal support
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -right-4 size-44 rounded-full bg-[#f5dce3] blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white bg-white shadow-[0_18px_60px_-35px_#8f1a37]">
              <div className="flex justify-between gap-3 px-5 pt-5 text-[10px] font-bold tracking-widest uppercase">
                <span className="text-brand">Power your possibilities</span>
                <span>01 / Solar & power</span>
              </div>
              <Image
                src="/products/meco-2kwh.jpg"
                alt="MECO portable power station from the Zhoppin solar collection"
                width={800}
                height={1080}
                priority
                sizes="(max-width:1023px) 90vw,45vw"
                className="aspect-[1.1] w-full object-cover object-[center_18%]"
              />
              <div className="flex items-center justify-between gap-4 bg-ink px-6 py-5 text-white">
                <div>
                  <p className="text-lg font-bold">
                    Less blackout. More living.
                  </p>
                  <p className="mt-1 text-xs text-white/65">
                    Find backup power that fits your everyday.
                  </p>
                </div>
                <Link
                  href="/shop?category=Solar+%26+power"
                  aria-label="Explore solar and power"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-brand"
                >
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-line">
        <div className="page-shell grid gap-5 py-6 sm:grid-cols-3">
          {[
            [
              ShieldCheck,
              "Products you can feel good about",
              "Clear specs. Helpful guidance.",
            ],
            [
              Truck,
              "From our store to your doorstep",
              "Delivery available nationwide.",
            ],
            [
              MessageCircle,
              "Real people, ready to help",
              "A conversation away on WhatsApp.",
            ],
          ].map(([Icon, title, description]) => {
            const I = Icon as typeof Truck;
            return (
              <div key={String(title)} className="flex items-center gap-3">
                <I
                  size={24}
                  strokeWidth={1.4}
                  className="shrink-0 text-brand"
                />
                <div>
                  <h2 className="text-xs font-bold">{String(title)}</h2>
                  <p className="mt-1 text-[11px] text-muted">
                    {String(description)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="page-shell py-15">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">A little more possibility</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Made for the way you live.
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-xs font-semibold text-brand"
          >
            Browse the store
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [Smartphone, "Smartphones", "Stay connected."],
            [Laptop, "Laptops", "Work. Create. Do more."],
            [Zap, "Solar & power", "Keep your world on."],
            [Headphones, "Lifestyle", "Upgrade the everyday."],
          ].map(([Icon, title, copy]) => {
            const I = Icon as typeof Zap;
            return (
              <Link
                key={String(title)}
                href={`/shop?category=${encodeURIComponent(String(title))}`}
                className="group rounded-xl border border-line bg-cream p-5 transition-colors hover:border-brand"
              >
                <I size={30} strokeWidth={1.3} className="mb-6 text-brand" />
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">{String(title)}</h3>
                  <ArrowUpRight size={14} />
                </div>
                <p className="mt-2 text-xs text-muted">{String(copy)}</p>
              </Link>
            );
          })}
        </div>
      </section>
      {weekly && (
        <section className="page-shell pb-15">
          <div className="overflow-hidden rounded-3xl bg-ink text-white lg:grid lg:grid-cols-[1.05fr_1fr]">
            <div className="relative min-h-80 bg-white">
              <Image
                src={weekly.image}
                alt={`${weekly.name}, Zhoppin Product of the Week`}
                fill
                sizes="(max-width:1023px) 100vw,50vw"
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="text-xs font-bold tracking-[0.18em] text-[#f5a8ba] uppercase">
                Product of the Week
              </p>
              <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                {weekly.name}
              </h2>
              <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/70">
                {weekly.description}
              </p>
              <p className="mt-5 text-2xl font-bold">{naira(weekly.price)}</p>
              <Link
                href={`/shop/${weekly.slug}`}
                className={buttonVariants({
                  variant: "secondary",
                  className:
                    "mt-7 w-fit border-white bg-white text-ink hover:bg-[#f7e9ed]",
                })}
              >
                View this week’s pick <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="bg-cream py-14">
        <div className="page-shell">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">In the spotlight</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Good energy. Great possibilities.
              </h2>
            </div>
            <p className="max-w-70 text-xs leading-6 text-muted">
              Explore our solar offers. We’ll confirm current price,
              availability and delivery before you pay.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          {!products.length && (
            <p className="rounded-xl bg-white p-6 text-sm text-muted">
              Fresh products are on the way.{" "}
              <a href={brand.whatsapp} className="font-semibold text-brand">
                Tell us what you’re looking for.
              </a>
            </p>
          )}
        </div>
      </section>
      <section
        id="why-zhoppin"
        className="page-shell grid items-center gap-9 py-17 md:grid-cols-2 lg:gap-18"
      >
        <div className="relative overflow-hidden rounded-2xl bg-stone-100">
          <Image
            src="/products/stockroom.jpg"
            alt="Supplied photograph of itel energy products in the stockroom"
            width={808}
            height={1080}
            sizes="(max-width:767px)90vw,45vw"
            className="aspect-[1.2] w-full object-cover"
          />
          <div className="absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-xl bg-white/95 p-4">
            <PackageCheck size={27} className="text-brand" />
            <div>
              <p className="text-sm font-bold">Good products. No guesswork.</p>
              <p className="mt-1 text-xs text-muted">
                Ask us about the details that matter to you.
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="eyebrow">Meet your everyday upgrade partner</p>
          <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            Shopping should feel
            <br />
            like a good decision.
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted">
            At Zhoppin, we make it easier to find the tech, power and essentials
            you need. We bring clear product information, straightforward
            conversations and personal support to every order.
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            {[
              "Know what you’re buying before you commit.",
              "Confirm your full price, including delivery.",
              "Get help from a real person, from enquiry to doorstep.",
            ].map((copy) => (
              <li key={copy} className="flex items-start gap-3">
                <Check size={17} className="mt-0.5 shrink-0 text-brand" />
                {copy}
              </li>
            ))}
          </ul>
          <a
            href={brand.whatsapp}
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand"
          >
            Get to know us
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section id="how-it-works" className="page-shell pb-16">
        <p className="eyebrow">Simple from the start</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Your upgrade, in three easy steps.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            [
              "01",
              "Find your fit",
              "Browse the store or tell us what you need. We’ll help confirm the right product and its availability.",
            ],
            [
              "02",
              "Confirm, then pay",
              "Submit your delivery details. Once we confirm stock and delivery cost, pay by bank transfer and upload your receipt.",
            ],
            [
              "03",
              "We take it from here",
              "We verify your payment, prepare your order and share delivery updates. Keep your private order link handy.",
            ],
          ].map(([num, title, copy]) => (
            <div key={num} className="rounded-xl border border-line p-6">
              <span className="text-xs font-bold text-brand">
                {num} <span className="ml-3 text-line">────────</span>
              </span>
              <h3 className="mt-6 text-base font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="contact"
        className="page-shell mb-16 overflow-hidden rounded-2xl bg-brand px-7 py-10 text-white sm:p-12"
      >
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-[10px] font-semibold tracking-[2px] text-white/75 uppercase">
              Good conversations. Better choices.
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
              Have something in mind?
              <br />
              Let’s find it together.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
              Need a phone, a laptop or help choosing a solar setup? Tell us
              what you’re looking for. We’re here to help.
            </p>
          </div>
          <div>
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-13 items-center justify-center gap-3 rounded-lg bg-white px-5 text-sm font-bold text-brand"
            >
              <MessageCircle size={19} />
              Chat with us on WhatsApp
              <ArrowUpRight size={16} />
            </a>
            <a
              href={`tel:${brand.internationalPhone}`}
              className="mt-4 flex items-center justify-center gap-2 text-sm"
            >
              <Phone size={15} />
              {brand.phone}
            </a>
            <a
              href={brand.channel}
              target="_blank"
              rel="noreferrer"
              className="mt-6 block text-center text-xs text-white/80 underline underline-offset-4"
            >
              Follow our WhatsApp channel for updates
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
