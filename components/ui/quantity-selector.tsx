"use client";
import { Minus, Plus } from "lucide-react";
export function QuantitySelector({
  value,
  onChange,
  label = "Quantity",
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-11 items-center rounded-lg border border-line bg-white"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className="grid size-11 place-items-center rounded-l-lg hover:bg-stone-50 disabled:opacity-30"
      >
        <Minus size={15} />
      </button>
      <span
        aria-live="polite"
        className="min-w-9 text-center text-sm font-semibold tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 99}
        aria-label={`Increase ${label.toLowerCase()}`}
        className="grid size-11 place-items-center rounded-r-lg hover:bg-stone-50 disabled:opacity-30"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
