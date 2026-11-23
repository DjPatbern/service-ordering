import Link from "next/link";
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Zhoppin home"
      className={`inline-flex shrink-0 items-center text-[27px] leading-none font-black tracking-[-1.6px] ${inverse ? "text-white" : "text-brand"}`}
    >
      <span
        className={`rounded-md px-1 pt-0.5 pb-1 ${inverse ? "bg-white text-brand" : "bg-brand text-white"}`}
      >
        zhop
      </span>
      <span>
        pin<span className="text-[19px] tracking-[-1px]">.ng</span>
      </span>
    </Link>
  );
}
