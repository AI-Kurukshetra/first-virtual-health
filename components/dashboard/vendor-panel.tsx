import type { Vendor } from "@/lib/types/cmms";
import { formatShortDate } from "@/lib/utils/formatters";

interface Props {
  vendors: Vendor[];
}

export const VendorPanel = ({ vendors }: Props) => (
  <section className="rounded-3xl border border-zinc-200/70 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/80">
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
      Preferred vendors
    </h2>
    <ul className="mt-4 space-y-4 text-sm">
      {vendors.map((vendor) => (
        <li
          key={vendor.id}
          className="flex items-center justify-between rounded-2xl border border-zinc-200/70 p-4 dark:border-white/10"
        >
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {vendor.name}
            </p>
            <p className="text-xs text-zinc-500">{vendor.specialty}</p>
            <p className="text-xs text-zinc-500">{vendor.contact}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-emerald-500">
              {vendor.score.toFixed(1)}
            </p>
            <p className="text-xs text-zinc-500">
              Last used {formatShortDate(vendor.lastEngaged)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
