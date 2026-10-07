"use client";
import { useState } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";
export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <Dialog.Root>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-stone-100">
          <Image
            src={images[selected]}
            alt={`${name} — ${selected === 0 ? "sample finished design" : "close-up of materials and finish"}`}
            width={600}
            height={460}
            priority
            sizes="(max-width: 767px) 90vw, 50vw"
            className="aspect-[1.15] w-full object-cover"
          />
          <Dialog.Trigger
            aria-label="Enlarge service image"
            className="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full bg-white/90 shadow-sm"
          >
            <Expand size={17} />
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(92vw,850px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-cream p-4">
            <Dialog.Title className="px-1 pt-1 pr-10 text-lg font-semibold">
              {name}
            </Dialog.Title>
            <Dialog.Description className="mt-1 mb-4 px-1 text-xs text-muted">
              Sample artwork to inspire your own brand.
            </Dialog.Description>
            <Image
              src={images[selected]}
              alt={`${name} enlarged sample`}
              width={850}
              height={650}
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
            <Dialog.Close
              aria-label="Close image"
              className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white"
            >
              <X size={20} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="mt-4 flex gap-3">
        {images.map((image, i) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelected(i)}
            aria-label={`Show ${i === 0 ? "overview" : "detail"} image`}
            aria-pressed={selected === i}
            className={cn(
              "overflow-hidden rounded-lg border-2 p-1",
              selected === i
                ? "border-brand"
                : "border-transparent hover:border-line",
            )}
          >
            <Image
              src={image}
              width={90}
              height={70}
              alt=""
              className="rounded-md"
            />
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">
        Sample designs shown for inspiration. Your order is tailored to your
        brand.
      </p>
    </div>
  );
}
