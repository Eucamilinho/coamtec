import Link from "next/link";
import { Gift } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-green-500/20 dark:to-emerald-400/10 p-6 sm:p-8 text-white dark:text-zinc-100 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Gift size={14} />
              Promo limitada
            </p>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black">Hasta 25% OFF en periféricos seleccionados</h3>
            <p className="mt-2 text-sm sm:text-base text-white/90 dark:text-zinc-200/90">Aprovecha descuentos exclusivos por tiempo limitado y renueva tu setup hoy.</p>
          </div>
          <Link
            href="/productos"
            className="inline-flex items-center justify-center rounded-xl bg-white text-blue-700 dark:text-zinc-900 px-5 py-3 text-sm font-bold hover:bg-zinc-100 transition"
          >
            Ver ofertas
          </Link>
        </div>
      </div>
    </section>
  );
}
