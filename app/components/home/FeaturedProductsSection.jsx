import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getProductUrl } from "../../lib/slugs";

const BotonCarrito = dynamic(() => import("../BotonCarrito"), { ssr: false });

function precioFinal(producto) {
  return producto.descuento > 0
    ? producto.precio - (producto.precio * producto.descuento) / 100
    : producto.precio;
}

export default function FeaturedProductsSection({ products = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Productos destacados</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Selección curada de lo más vendido y mejor valorado.</p>
        </div>
        <Link href="/productos" className="text-sm font-semibold text-blue-600 dark:text-green-400 hover:underline">
          Ver todos
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {products.map((producto) => {
          const final = precioFinal(producto);
          return (
            <article
              key={producto.id}
              className="group rounded-2xl border-none bg-white dark:bg-zinc-900 p-4 shadow-md shadow-zinc-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:shadow-none"
            >
              <Link href={getProductUrl(producto)} className="block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shimmer-bg">
                  <Image
                    src={producto.imagen}
                    alt={`${producto.nombre} ${producto.categoria ? `- ${producto.categoria}` : ""}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="pt-3 space-y-2">
                {producto.categoria && (
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                    {producto.categoria}
                  </p>
                )}
                <Link href={getProductUrl(producto)}>
                  <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-green-400 transition">
                    {producto.nombre}
                  </h3>
                </Link>

                <div className="flex items-end gap-2">
                  <span className="text-lg font-extrabold text-zinc-900 dark:text-white">${final.toLocaleString()}</span>
                  {producto.descuento > 0 && (
                    <span className="text-xs line-through text-zinc-500 dark:text-zinc-400">${Number(producto.precio).toLocaleString()}</span>
                  )}
                </div>

                {producto.stock === 0 ? (
                  <button
                    disabled
                    aria-disabled="true"
                    className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 py-2.5 text-sm font-semibold text-zinc-500"
                  >
                    No disponible
                  </button>
                ) : (
                  <BotonCarrito producto={{ ...producto, precio: final }} />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
