"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Componente 3D - lazy load
const Teclado3D = dynamic(() => import("./Teclado3D"), {
  ssr: false,
  loading: () => <div className="w-full h-full shimmer-bg rounded-xl" />,
});

export default function HeroSection({ featuredProducts = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    if (!Array.isArray(featuredProducts) || featuredProducts.length === 0) {
      return [];
    }
    return featuredProducts.slice(0, 5);
  }, [featuredProducts]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex > slides.length - 1) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  const activeProduct = slides[activeIndex];

  const irAnterior = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const irSiguiente = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Gradiente decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),transparent_48%)] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.15),transparent_48%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        {/* Elemento 3D - Arriba en móvil */}
        <div className="lg:hidden mb-6">
          <div className="h-[150px] sm:h-[180px]">
            <Teclado3D />
          </div>
        </div>

        <div className="grid items-center gap-6 lg:gap-4 lg:grid-cols-12">
          {/* Elemento 3D - Izquierda en desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="h-[280px]">
              <Teclado3D />
            </div>
          </div>

          {/* Contenido central */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              Tecnología gamer para un setup
              <span className="text-green-500"> impecable</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Descubre periféricos y accesorios seleccionados para rendimiento, estilo y comodidad.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-600"
              >
                Ver catálogo
                <ArrowRight size={14} className="sm:w-4 sm:h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/checkout"
                className="rounded-full bg-zinc-900 dark:bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white dark:text-zinc-900 transition hover:bg-zinc-800 dark:hover:bg-zinc-100"
              >
                Comprar ahora
              </Link>
            </div>

            {/* Social proof - solo desktop */}
            <div className="hidden lg:flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-950" />
                  ))}
                </div>
                <div className="text-xs">
                  <span className="font-bold text-zinc-900 dark:text-white">+2,000</span>
                  <span className="text-zinc-500 dark:text-zinc-400 ml-1">clientes</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-yellow-500">★</span>
                <span className="font-bold text-zinc-900 dark:text-white">4.9</span>
                <span className="text-zinc-500 dark:text-zinc-400">(120+)</span>
              </div>
            </div>
          </div>

          {/* Carrusel de productos */}
          <div className="lg:col-span-4 relative w-full overflow-hidden">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 sm:p-3 shadow-lg">
              <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] overflow-hidden rounded-lg shimmer-bg">
                {slides.map((slide, index) => (
                  <Link 
                    key={slide.id || index}
                    href={`/productos/${slide.id}`}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                  >
                    <Image
                      src={slide?.imagen}
                      alt={slide?.nombre || "Producto destacado"}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      style={{ position: 'absolute', width: '100%', height: '100%' }}
                    />
                  </Link>
                ))}

                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={irAnterior}
                      aria-label="Ver producto anterior"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white shadow-lg hover:bg-white dark:hover:bg-zinc-800 transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={irSiguiente}
                      aria-label="Ver producto siguiente"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white shadow-lg hover:bg-white dark:hover:bg-zinc-800 transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[10px] uppercase tracking-wider text-green-500 font-semibold">
                    {activeProduct?.categoria || "Destacado"}
                  </p>
                  <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                    {activeProduct?.nombre || "Coam Tec"}
                  </p>
                </div>

                {slides.length > 1 && (
                  <div className="flex items-center gap-1" role="tablist" aria-label="Indicadores de carrusel">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id || index}
                        type="button"
                        role="tab"
                        aria-label={`Ver producto ${index + 1}`}
                        aria-selected={index === activeIndex}
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-5 bg-green-500" : "w-1.5 bg-zinc-300 dark:bg-zinc-700"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
