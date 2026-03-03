"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrito } from "../store/carritoStore";
import { useWishlist } from "../store/wishlistStore";
import { useCompraRapida } from "../store/compraRapidaStore";
import {
  ShoppingCart,
  Heart,
  Zap,
  Star,
  Shield,
  Truck,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  X,
  ChevronLeft,
  ZoomIn,
} from "lucide-react";

export default function DetalleProductoClient({ producto, relacionados = [] }) {
  const agregarProducto = useCarrito((state) => state.agregarProducto);
  const { items: wishlistItems, toggleWishlist } = useWishlist();
  const setCompraRapida = useCompraRapida((store) => store.setItems);

  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const enWishlist = mounted && wishlistItems.some((item) => item.id === producto?.id);

  if (!producto) return null;

  const imagenes =
    producto.imagenes && producto.imagenes.length > 0
      ? producto.imagenes.filter(Boolean)
      : [producto.imagen].filter(Boolean);

  const precioFinal =
    producto.descuento > 0
      ? producto.precio - (producto.precio * producto.descuento) / 100
      : producto.precio;

  const ahorro = Math.max(0, Number(producto.precio) - Number(precioFinal));

  const agregarAlCarrito = () => {
    for (let index = 0; index < cantidad; index += 1) {
      agregarProducto({ ...producto, precio: precioFinal });
    }
  };

  const cambiarImagen = (index) => setImagenActiva(index);

  const irAnterior = () => {
    setImagenActiva((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const irSiguiente = () => {
    setImagenActiva((prev) => (prev + 1) % imagenes.length);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setModalAbierto(false)}
        >
          <button
            type="button"
            aria-label="Cerrar galería"
            onClick={() => setModalAbierto(false)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white transition hover:bg-zinc-700"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            aria-label="Imagen anterior"
            onClick={(event) => {
              event.stopPropagation();
              irAnterior();
            }}
            className="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white transition hover:bg-zinc-700"
          >
            <ChevronLeft size={20} />
          </button>

          <Image
            src={imagenes[imagenActiva]}
            alt={producto.nombre}
            width={900}
            height={900}
            unoptimized
            className="max-h-[90vh] max-w-4xl rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            aria-label="Imagen siguiente"
            onClick={(event) => {
              event.stopPropagation();
              irSiguiente();
            }}
            className="absolute right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white transition hover:bg-zinc-700"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <nav className="mb-7 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-green-600 dark:hover:text-green-400">
            Inicio
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link href="/productos" className="transition hover:text-green-600 dark:hover:text-green-400">
            Productos
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="truncate text-zinc-800 dark:text-white" aria-current="page">{producto.nombre}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <section className="space-y-4">
            <div
              className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 cursor-zoom-in"
              onClick={() => setModalAbierto(true)}
            >
              {producto.descuento > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-green-400 px-3 py-1 text-xs font-black text-black">
                  -{producto.descuento}%
                </span>
              )}
              <Image
                src={imagenes[imagenActiva]}
                alt={producto.nombre}
                width={900}
                height={900}
                priority
                unoptimized
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                <ZoomIn size={12} /> Ampliar
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {imagenes.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  aria-label={`Seleccionar imagen ${index + 1}`}
                  onClick={() => cambiarImagen(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    index === imagenActiva
                      ? "border-green-600 dark:border-green-500"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-green-500"
                  }`}
                >
                  <Image src={img} alt={`${producto.nombre} miniatura ${index + 1}`} fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            {producto.categoria && (
              <p className="inline-flex rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                {producto.categoria}
              </p>
            )}

            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {producto.nombre}
            </h1>

            <div className="flex items-center gap-1 text-yellow-500" role="img" aria-label="Valoración: 4.8 de 5 estrellas">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star key={index} size={15} className="fill-current" aria-hidden="true" />
              ))}
              <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">4.8 (reseñas verificadas)</span>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 space-y-4">
              <div className="flex items-end gap-3 flex-wrap">
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-green-400">
                  ${precioFinal.toLocaleString()}
                </p>
                {producto.descuento > 0 && (
                  <p className="text-sm text-zinc-500 line-through">
                    ${Number(producto.precio).toLocaleString()}
                  </p>
                )}
                {ahorro > 0 && (
                  <p className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-500">
                    Ahorras ${ahorro.toLocaleString()}
                  </p>
                )}
              </div>

              <p className="text-sm font-semibold text-emerald-500">
                {producto.stock > 0 ? `Disponible (${producto.stock} unidades)` : "Producto sin stock"}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Cantidad:</span>
                <div className="inline-flex items-center overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700">
                  <button
                    type="button"
                    aria-label="Disminuir cantidad"
                    onClick={() => setCantidad((value) => Math.max(1, value - 1))}
                    className="inline-flex h-11 w-11 items-center justify-center transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Minus size={18} aria-hidden="true" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold" aria-live="polite">{cantidad}</span>
                  <button
                    type="button"
                    aria-label="Aumentar cantidad"
                    onClick={() => setCantidad((value) => value + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Plus size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={agregarAlCarrito}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700"
                >
                  <ShoppingCart size={17} aria-hidden="true" /> Añadir al carrito
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCompraRapida([{ ...producto, precio: precioFinal }]);
                    router.push("/checkout/rapido");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-green-600 px-5 py-3 text-sm font-bold text-green-600 transition hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500/10"
                >
                  <Zap size={16} aria-hidden="true" /> Comprar ahora
                </button>

                <button
                  type="button"
                  aria-label={enWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
                  aria-pressed={enWishlist}
                  onClick={() => toggleWishlist(producto)}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                    enWishlist
                      ? "border-red-400 bg-red-400 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-500"
                  }`}
                >
                  <Heart size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <p className="inline-flex items-center gap-2"><Truck size={16} className="text-green-500" aria-hidden="true" /> Envío rápido en Colombia</p>
              <p className="inline-flex items-center gap-2"><Shield size={16} className="text-green-500" aria-hidden="true" /> Garantía de 1 año</p>
              <p className="inline-flex items-center gap-2"><RotateCcw size={16} className="text-green-500" aria-hidden="true" /> Devolución en 30 días</p>
            </div>

            <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Descripción</h2>
              <div
                className="prose prose-sm mt-3 max-w-none text-zinc-700 dark:prose-invert dark:text-zinc-300"
                dangerouslySetInnerHTML={{
                  __html: producto.descripcion || "Descripción no disponible.",
                }}
              />

              {producto.caracteristicas && producto.caracteristicas.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Características</h3>
                  <ul className="mt-2 list-disc list-inside text-zinc-600 dark:text-zinc-400">
                    {producto.caracteristicas.map((caracteristica, index) => (
                      <li key={index}>{caracteristica}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          </section>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Productos relacionados</h2>
              <Link href="/productos" className="text-sm font-semibold text-green-600 dark:text-green-400 hover:underline">
                Ver más productos
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relacionados.map((item) => {
                const precioItem = item.descuento > 0
                  ? item.precio - (item.precio * item.descuento) / 100
                  : item.precio;

                return (
                  <Link key={item.id} href={`/productos/${item.id}`} className="group">
                    <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_0_0_1px_rgba(39,39,42,0.5),0_10px_24px_rgba(0,0,0,0.35)]">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl shimmer-bg">
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          unoptimized
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="pt-3">
                        <p className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-white">
                          {item.nombre}
                        </p>
                        <p className="mt-2 text-lg font-black text-zinc-900 dark:text-green-400">
                          ${precioItem.toLocaleString()}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
