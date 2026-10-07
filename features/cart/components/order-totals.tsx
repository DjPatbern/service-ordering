import { money, markets, type Market } from "@/lib/markets";
export function OrderTotals({
  subtotal,
  tax,
  total,
  market,
}: {
  subtotal: number;
  tax: number;
  total: number;
  market: Market;
}) {
  return (
    <div>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd data-testid="subtotal">{money(subtotal, market)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            Estimated tax ({Number((markets[market].taxRate * 100).toFixed(2))}
            %)
          </dt>
          <dd data-testid="tax">{money(tax, market)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-line pt-4 text-lg font-semibold">
          <dt>
            Total{" "}
            <span className="text-xs font-normal text-muted">
              {markets[market].currency}
            </span>
          </dt>
          <dd data-testid="total">{money(total, market)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[10px] leading-5 text-muted">
        Illustrative market tax for this demo. Physical delivery is not
        included. Final tax and delivery would be confirmed before payment.
      </p>
    </div>
  );
}
