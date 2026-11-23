import Link from "next/link";
import { ArrowUpRight, Phone, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { brand } from "@/lib/brand";
export function Footer() {
  return (
    <footer className="bg-ink pt-14 pb-7 text-white">
      <div className="page-shell">
        <div className="grid gap-10 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo inverse />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
              Good tech. Reliable power. A better everyday.
              <br />
              Your Nigerian store for the things that move you forward.
            </p>
            <p className="mt-5 flex items-center gap-2 text-xs text-white/70">
              <MapPin size={14} />
              Nigeria · Nationwide delivery
            </p>
          </div>
          <div>
            <h2 className="mb-5 text-sm font-semibold">
              Make yourself at home
            </h2>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <Link href="/shop">Shop all products</Link>
              <Link href="/#how-it-works">How to order</Link>
              <Link href="/#contact">Talk to Zhoppin</Link>
              <Link href="/privacy">Privacy & order terms</Link>
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-sm font-semibold">Stay in the loop</h2>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              {[
                [brand.channel, "WhatsApp channel"],
                [brand.tiktok, "TikTok"],
                [brand.facebook, "Facebook"],
              ].map(([href, label]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  {label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
              <a
                href={`tel:${brand.internationalPhone}`}
                className="mt-2 flex items-center gap-2"
              >
                <Phone size={13} />
                {brand.phone}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-[11px] text-white/50">
          <span>
            © {new Date().getFullYear()} zhoppin.ng. All rights reserved.
          </span>
          <div className="flex gap-5">
            <span>Made for life in Nigeria.</span>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
