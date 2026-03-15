"use client";

import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="w-full py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* CTA minimalista */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10 rounded-2xl bg-zinc-900 dark:bg-zinc-900/50 border border-zinc-800">
          
          {/* Texto */}
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-2">
              Envíos a todo Colombia
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              ¿Listo para mejorar tu setup?
            </h3>
            <p className="text-sm text-zinc-400">
              Envío gratis en pedidos mayores a $500.000
            </p>
          </div>
          
          {/* Botón */}
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 bg-white text-zinc-900 px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-100 transition-all active:scale-95"
          >
            Ver productos
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
