import type { InventoryItem } from "@/lib/types/cmms";
import { formatCurrency } from "@/lib/utils/formatters";

interface Props {
  items: InventoryItem[];
}

export const InventoryPanel = ({ items }: Props) => (
  <section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
    <header className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Inventory watchlist
      </h2>
      <span className="text-xs uppercase tracking-wide text-rose-500">
        {items.filter((item) => item.quantity <= item.minThreshold).length} low
      </span>
    </header>
    <div className="mt-4 space-y-4">
      {items.map((item) => {
        const needsRestock = item.quantity <= item.minThreshold;
        return (
          <article
            key={item.id}
            className="rounded-2xl border border-zinc-200/70 p-4 dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-xs font-mono text-zinc-500">{item.sku}</p>
                <p className="text-xs text-zinc-500">
                  {item.storageLocation} · {item.supplier}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{item.quantity}</p>
                <p className="text-xs text-zinc-500">
                  Min {item.minThreshold}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span>{formatCurrency(item.unitCost)} per unit</span>
              {needsRestock ? (
                <span className="rounded-full bg-rose-500/15 px-2 py-0.5 font-semibold text-rose-600">
                  Reorder now
                </span>
              ) : (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-600">
                  Healthy
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  </section>
);
