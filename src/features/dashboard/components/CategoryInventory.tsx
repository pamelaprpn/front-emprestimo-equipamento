import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { InventoryCategory } from "@/features/dashboard/types";

type CategoryInventoryProps = {
  categories: readonly InventoryCategory[];
};

export default function CategoryInventory({
  categories,
}: CategoryInventoryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Inventário por categoria
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Equipamentos cadastrados por categoria
          </p>
        </div>
        <Link
          aria-label="Ver equipamentos"
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          href="/equipamentos"
          prefetch={false}
        >
          <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </div>
      <ul className="mt-5 divide-y divide-slate-100">
        {categories.length === 0 ? (
          <li className="py-4 text-sm text-slate-500">
            Nenhum equipamento cadastrado.
          </li>
        ) : (
          categories.map((category) => (
            <li
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              key={category.id}
            >
              <span className="text-sm font-medium text-slate-700">
                {category.name}
              </span>
              <span className="whitespace-nowrap text-sm text-slate-500">
                {category.quantity} itens
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
