import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Globe2,
  Sparkles,
  Layers3,
} from "lucide-react";
import { markets, type Market } from "@/lib/markets";
import { buttonVariants } from "@/components/ui/button";
export function Hero({ market }: { market: Market }) {
  return (
    <>
      <section
        className="page-shell grid items-center gap-8 pt-10 pb-9 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-12 lg:pb-12"
        aria-labelledby="hero-title"
      >
        <div className="py-3 lg:py-7">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#dce0cc] bg-[#f1f2e8] px-3 py-1.5 text-[10px] font-semibold tracking-[1.7px] uppercase">
            <span className="size-1.5 rounded-full bg-brand" />
            Your next chapter starts here
          </div>
          <h1
            id="hero-title"
            className="font-display text-[clamp(3.1rem,5.8vw,5.4rem)] leading-[1.06] tracking-[-3px]"
          >
            Big ideas.
            <br />
            <span className="text-brand italic">Beautifully</span>
            <br />
            branded.
          </h1>
          <p className="mt-6 max-w-105 text-sm leading-7 text-muted sm:text-base">
            {markets[market].description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <a
              href="#services"
              className={buttonVariants({ className: "min-h-12 px-6" })}
            >
              Find your next service <ArrowUpRight size={17} />
            </a>
            <a
              href="#how-it-works"
              className="flex min-h-11 items-center gap-2 text-sm font-medium"
            >
              See how it works <ArrowDown size={14} />
            </a>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[11px] text-muted">
            <span className="flex -space-x-1.5" aria-hidden="true">
              {["#bdc5a6", "#dcc8b3", "#d0c1cd"].map((color, i) => (
                <span
                  key={color}
                  style={{ background: color }}
                  className="grid size-7 place-items-center rounded-full border-2 border-cream text-[9px] font-bold text-brand"
                >
                  {["B", "O", "A"][i]}
                </span>
              ))}
            </span>
            <span>
              For businesses with{" "}
              <span className="font-semibold text-ink">big possibilities.</span>
            </span>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[18px] bg-[#eeefdc]">
          <Image
            src="/images/hero.svg"
            alt="A coordinated brand collection with a custom tote, brand book, ceramic mug and stationery"
            width={600}
            height={550}
            priority
            sizes="(max-width: 1023px) 90vw, 46vw"
            className="h-auto w-full"
          />
          <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-xl border border-white/70 bg-white/85 px-4 py-3 backdrop-blur-sm sm:right-6 sm:bottom-6 sm:left-6">
            <div>
              <p className="text-[10px] font-medium tracking-widest text-muted uppercase">
                A whole world of branding
              </p>
              <p className="mt-1 text-xs font-semibold sm:text-sm">
                One idea. A thousand ways to bring it to life.
              </p>
            </div>
            <span className="ml-2 grid size-8 shrink-0 place-items-center rounded-full bg-brand text-white">
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </section>
      <div className="border-y border-line">
        <div className="page-shell grid gap-4 py-5 sm:grid-cols-3 sm:gap-8">
          {[
            {
              icon: Layers3,
              title: "One connected ecosystem",
              text: "Everything your brand needs, together.",
            },
            {
              icon: Sparkles,
              title: "Thoughtfully made, every time",
              text: "Creative care from start to finish.",
            },
            {
              icon: Globe2,
              title: "Local understanding. Global reach.",
              text: "Nigeria · USA · UK · Canada",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon
                size={22}
                strokeWidth={1.3}
                className="shrink-0 text-brand"
              />
              <div>
                <p className="text-xs font-semibold">{title}</p>
                <p className="mt-1 text-[11px] text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export function BrandStory({ market }: { market: Market }) {
  return (
    <>
      <section id="how-it-works" className="page-shell scroll-mt-8 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[2px] text-brand uppercase">
              From idea to in your hands
            </p>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Great branding. A simpler journey.
            </h2>
          </div>
          <p className="max-w-70 text-sm leading-6 text-muted">
            Less running around. More bringing your vision to life.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [
              "01",
              "Find your fit",
              "Explore services, choose your options and build a collection that works for your brand.",
            ],
            [
              "02",
              "Make it yours",
              "Place your order, share your brief and work with our team to get every detail right.",
            ],
            [
              "03",
              "Meet your next chapter",
              "Approve your designs and receive thoughtful work, ready to make an impression.",
            ],
          ].map(([num, title, description]) => (
            <div
              key={num}
              className="rounded-xl border border-line bg-white/40 p-6"
            >
              <span className="text-xs font-semibold text-brand">
                {num} <span className="ml-2 text-line">────────</span>
              </span>
              <h3 className="mt-6 text-base font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="our-promise"
        className="page-shell mb-16 overflow-hidden rounded-2xl bg-brand px-7 py-10 text-white sm:px-12"
      >
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-4 text-[10px] tracking-[2px] text-[#d3dfb9] uppercase">
              The Branda difference
            </p>
            <h2 className="max-w-140 font-display text-3xl leading-tight sm:text-4xl">
              {markets[market].headline}
            </h2>
            <p className="mt-4 max-w-115 text-sm leading-6 text-white/75">
              Your brand is more than a logo. We connect the details, from the
              way you show up online to the things people hold in their hands.
            </p>
          </div>
          <ul className="space-y-5 text-sm">
            {[
              "A consistent look across every touchpoint",
              "Clear pricing, with no guesswork",
              "Real creative care behind every service",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="shrink-0 text-[#c5d6a4]" size={18} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
