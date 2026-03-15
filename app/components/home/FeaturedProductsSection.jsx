"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getProductUrl } from "../../lib/slugs";

const BotonCarrito = dynamic(() => import("../BotonCarrito"), { ssr: false });

function precioFinal(producto) {
  return producto.descuento > 0
    ? Math.round(producto.precio * (1 - producto.descuento / 100))
    : producto.precio;
}

function formatearPrecio(precio) {
  return precio.toLocaleString('es-CO');
}

export default function FeaturedProductsSection({ products = [] }) {
  if (products.length === 0) return null;

  return (
    <section className="w-full bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
            Catálogo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">
            Productos destacados
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Selección curada de lo mejor en accesorios gamer
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((producto) => {
            const final = precioFinal(producto);
            
            return (
              <article
                key={producto.id}
                className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 transition-all duration-300 hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                {/* Badge de descuento */}
                {producto.descuento > 0 && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    -{producto.descuento}%
                  </div>
                )}

                {/* Imagen */}
                <Link href={getProductUrl(producto)} className="block relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay sutil en hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </Link>

                {/* Info */}
                <div className="p-4">
                  {/* Categoría */}
                  {producto.categoria && (
                    <p className="text-[10px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500 mb-1.5">
                      {producto.categoria}
                    </p>
                  )}

                  {/* Nombre */}
                  <Link href={getProductUrl(producto)}>
                    <h3 className="font-medium text-sm text-zinc-900 dark:text-white line-clamp-2 leading-snug hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                      {producto.nombre}
                    </h3>
                  </Link>

                  {/* Precio */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                      ${formatearPrecio(final)}
                    </span>
                    {producto.descuento > 0 && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                        ${formatearPrecio(producto.precio)}
                      </span>
                    )}
                  </div>

                  {/* Stock status o botón */}
                  <div className="mt-3">
                    {producto.stock === 0 ? (
                      <span className="inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                        Agotado
                      </span>
                    ) : (
                      <BotonCarrito producto={{ ...producto, precio: final }} />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Ver todos */}
        <div className="mt-12 text-center">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Ver todos los productos
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
