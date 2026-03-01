"use client";

import { useState } from "react";
import { useCarrito } from "../store/carritoStore";
import { useWishlist } from "../store/wishlistStore";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Zap,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Lock,
  ChevronRight,
  Minus,
  Plus,
  X,
  ChevronLeft,
  ZoomIn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCompraRapida } from "../store/compraRapidaStore";

export default function DetalleProductoClient({ producto }) {
  const agregarProducto = useCarrito((state) => state.agregarProducto);
  const { items: wishlistItems, toggleWishlist } = useWishlist();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const enWishlist = wishlistItems.some((p) => p.id === producto?.id);
  const router = useRouter();
  const setCompraRapida = useCompraRapida((s) => s.setItems);

  if (!producto) return null;

  const todasLasImagenes =
    producto.imagenes && producto.imagenes.length > 0
      ? producto.imagenes.filter(Boolean)
      : [producto.imagen].filter(Boolean);

  const precioFinal =
    producto.descuento > 0
      ? producto.precio - (producto.precio * producto.descuento) / 100
      : producto.precio;

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarProducto({ ...producto, precio: precioFinal });
    }
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const irAnterior = () =>
    setImagenActiva(
      (prev) => (prev - 1 + todasLasImagenes.length) % todasLasImagenes.length,
    );
  const irSiguiente = () =>
    setImagenActiva((prev) => (prev + 1) % todasLasImagenes.length);

  const restarCantidad = () => {
    if (cantidad === 1) {
      useCarrito.getState().eliminarProducto(producto.id);
    } else {
      setCantidad((c) => c - 1);
    }
  };

  const sumarCantidad = () => {
    setCantidad((c) => c + 1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-20">
      {/* Modal imagen grande */}
      {modalAbierto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setModalAbierto(false)}
        >
          <button
            onClick={() => setModalAbierto(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <X size={20} className="text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              irAnterior();
            }}
            className="absolute left-4 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <img
            src={todasLasImagenes[imagenActiva]}
            alt={producto.nombre}
            className="max-w-3xl max-h-screen object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              irSiguiente();
            }}
            className="absolute right-4 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          {/* Dots modal */}
          <div className="absolute bottom-6 flex gap-2">
            {todasLasImagenes.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setImagenActiva(i);
                }}
                className={`rounded-full transition-all ${i === imagenActiva ? "w-6 h-2 bg-green-400" : "w-2 h-2 bg-zinc-600 hover:bg-zinc-400"}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-green-400 transition">
            Inicio
          </Link>
          <ChevronRight size={14} />
          <Link href="/productos" className="hover:text-green-400 transition">
            Productos
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-600 dark:text-zinc-300">
            {producto.nombre}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería */}
          <div className="flex flex-col gap-4">
            {/* Imagen principal */}
            <div
              className="relative bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center cursor-zoom-in group shadow-sm hover:shadow-lg transition"
              onClick={() => setModalAbierto(true)}
            >
              {producto.descuento > 0 && (
                <span className="absolute top-4 left-4 bg-green-400 text-black text-sm font-black px-3 py-1 rounded-full z-10">
                  -{producto.descuento}% HOY
                </span>
              )}
              {producto.stock <= 3 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  ⚡ Últimas unidades
                </span>
              )}
              <img
                src={todasLasImagenes[imagenActiva]}
                alt={producto.nombre}
                width="600"
                height="600"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {/* Hint zoom */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <ZoomIn size={12} />
                Click para ampliar
              </div>

              {/* Flechas navegación */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  irAnterior();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-zinc-800/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft
                  size={16}
                  className="text-zinc-700 dark:text-white"
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  irSiguiente();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-zinc-800/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight
                  size={16}
                  className="text-zinc-700 dark:text-white"
                />
              </button>
            </div>

            {/* thumbnails */}
            <div className="flex gap-2">
              {todasLasImagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagenActiva(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    i === imagenActiva
                      ? "border-green-400"
                      : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${producto.nombre} ${i + 1}`}
                    width="120"
                    height="120"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-black text-zinc-800 dark:text-white">
              {producto.nombre}
            </h1>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
              <span className="text-zinc-500 text-sm">4.8</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">{producto.descripcion}</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-extrabold text-green-500">
                  ${precioFinal.toLocaleString()}
                </span>
                {producto.descuento > 0 && (
                  <span className="text-sm text-zinc-400 line-through">
                    ${producto.precio.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="flex gap-3">
                  <button
                    onClick={handleAgregar}
                    className="bg-green-400 text-black font-black py-3 px-6 rounded-xl hover:bg-green-300 transition flex items-center gap-2 shadow-md"
                  >
                    <ShoppingCart size={18} /> Añadir al carrito
                  </button>
                  <button
                    onClick={() => {
                      setCompraRapida([{ ...producto, precio: precioFinal }]);
                      router.push('/checkout/rapido');
                    }}
                    className="bg-black text-white font-bold py-3 px-5 rounded-xl hover:opacity-95 transition flex items-center gap-2 shadow"
                  >
                    <Zap size={16} /> Comprar ahora
                  </button>
                </div>

                <div className="ml-auto">
                  <button
                    onClick={() => toggleWishlist(producto)}
                    className={`p-3 rounded-xl transition ${
                      enWishlist ? "bg-red-400 text-white" : "bg-zinc-100 dark:bg-zinc-900"
                    }`}
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              {/* cantidad */}
              <div className="flex items-center gap-3 mt-2">
                <button onClick={restarCantidad} className="text-zinc-500">
                  <Minus size={18} />
                </button>
                <span className="font-bold">{cantidad}</span>
                <button onClick={sumarCantidad} className="text-zinc-500">
                  <Plus size={18} />
                </button>
              </div>

              {/* Badges & details */}
              <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Truck size={16} /> <span>Envío rápido desde Bogotá</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} /> <span>Garantía 1 año</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} /> <span>Devolución en 30 días</span>
                </div>
              </div>

              {/* Descripción ampliada */}
              <div className="mt-6">
                <h2 className="text-lg font-bold mb-2">Descripción</h2>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {producto.descripcion || "Descripción no disponible."}
                </p>
              </div>

              {producto.caracteristicas && producto.caracteristicas.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Características</h3>
                  <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 mt-2">
                    {producto.caracteristicas.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
