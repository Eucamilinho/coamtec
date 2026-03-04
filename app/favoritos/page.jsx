"use client";

import { useWishlist } from "../store/wishlistStore";
import { getProductUrl } from "../lib/slugs";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { useCarrito } from "../store/carritoStore";

export default function FavoritosPage() {
  const { items: wishlist, toggleWishlist } = useWishlist();
  const addToCarrito = useCarrito((state) => state.addItem);

  const precioFinal = (producto) => {
    if (producto.oferta && producto.precio_oferta) {
      return producto.precio_oferta;
    }
    return producto.precio;
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Mis Favoritos
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {wishlist.length === 0 
                ? "No tienes productos favoritos aún" 
                : `${wishlist.length} producto${wishlist.length > 1 ? 's' : ''} guardado${wishlist.length > 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>

        {/* Contenido */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <Heart size={32} className="text-zinc-400" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Aún no tienes favoritos
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
              Explora nuestros productos y guarda tus favoritos para encontrarlos fácilmente después
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((producto) => (
              <div key={producto.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                {/* Botón remover favorito */}
                <button
                  onClick={() => toggleWishlist(producto)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <Heart size={16} fill="currentColor" />
                </button>

                {/* Imagen del producto */}
                <Link href={getProductUrl(producto)} className="block">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {producto.oferta && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        OFERTA
                      </div>
                    )}
                  </div>
                </Link>

                {/* Información del producto */}
                <div className="space-y-2">
                  <Link href={getProductUrl(producto)}>
                    <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-green-500 transition line-clamp-2">
                      {producto.nombre}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-500">
                      ${precioFinal(producto).toLocaleString()}
                    </span>
                    {producto.oferta && producto.precio_oferta && (
                      <span className="text-sm text-zinc-500 line-through">
                        ${producto.precio.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => addToCarrito(producto)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart size={16} />
                      Agregar
                    </button>
                    <Link
                      href={getProductUrl(producto)}
                      className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium py-2 px-4 rounded-lg transition text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}