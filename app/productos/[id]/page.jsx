"use client"

import { useState, use } from "react"
import { useProductos } from "../../store/productosStore"
import { useCarrito } from "../../store/carritoStore"
import { useWishlist } from "../../store/wishlistStore"
import Link from "next/link"
import { ShoppingCart, Heart, Zap, Star, Shield, Truck, RotateCcw, Lock, ChevronRight, Minus, Plus } from "lucide-react"

export default function DetalleProducto({ params }) {
  const { id } = use(params)
  const productos = useProductos((state) => state.productos)
  const agregarProducto = useCarrito((state) => state.agregarProducto)
  const { items: wishlistItems, toggleWishlist } = useWishlist()
  const producto = productos.find((p) => p.id === Number(id))
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const enWishlist = wishlistItems.some((p) => p.id === producto?.id)

  if (!producto) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">Producto no encontrado</h1>
          <Link href="/productos" className="text-green-400 hover:underline">
            Volver a productos
          </Link>
        </div>
      </div>
    )
  }

  const precioFinal = producto.descuento > 0
    ? producto.precio - (producto.precio * producto.descuento) / 100
    : producto.precio

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarProducto({ ...producto, precio: precioFinal })
    }
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-green-400 transition">Inicio</Link>
          <ChevronRight size={14} />
          <Link href="/productos" className="hover:text-green-400 transition">Productos</Link>
          <ChevronRight size={14} />
          <span className="text-zinc-600 dark:text-zinc-300">{producto.nombre}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Galería */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
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
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Miniaturas */}
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden cursor-pointer hover:border-green-400 transition"
                >
                  <img
                    src={producto.imagen}
                    alt=""
                    className="w-full h-full object-cover opacity-70 hover:opacity-100 transition"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">

            <div>
              <span className="text-green-400 font-mono text-sm tracking-widest uppercase">
                {producto.categoria}
              </span>
              <h1 className="text-4xl font-black tracking-tight mt-2 leading-tight text-zinc-900 dark:text-white">
                {producto.nombre}
              </h1>
            </div>

            {/* Reseñas */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-zinc-500 text-sm">4.8 · 124 opiniones</span>
            </div>

            {/* Precio */}
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
              {producto.descuento > 0 && (
                <span className="text-zinc-400 line-through text-lg">
                  ${Number(producto.precio).toLocaleString()}
                </span>
              )}
              <span className="text-4xl font-black text-green-400">
                ${precioFinal.toLocaleString()}
              </span>
              {producto.descuento > 0 && (
                <span className="text-green-400 text-sm font-medium">
                  Ahorras ${(producto.precio - precioFinal).toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${producto.stock > 3 ? "bg-green-400" : "bg-red-500"}`} />
              <span className="text-sm text-zinc-500">
                {producto.stock > 3
                  ? `${producto.stock} unidades disponibles`
                  : `⚡ Solo quedan ${producto.stock} unidades`}
              </span>
            </div>

            {/* Beneficios */}
            <div className="flex flex-col gap-2">
              <h3 className="text-zinc-700 dark:text-zinc-300 font-semibold">¿Por qué elegirlo?</h3>
              <ul className="flex flex-col gap-2">
                {[
                  { icon: <Shield size={14} />, text: "Garantía de 12 meses" },
                  { icon: <Truck size={14} />, text: "Envío a todo Colombia" },
                  { icon: <RotateCcw size={14} />, text: "Devoluciones en 30 días" },
                  { icon: <Lock size={14} />, text: "Pago 100% seguro" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-2 text-zinc-500 text-sm">
                    <span className="text-green-400">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cantidad */}
            <div className="flex items-center gap-4">
              <span className="text-zinc-500 text-sm">Cantidad:</span>
              <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
                >
                  <Minus size={16} />
                </button>
                <span className="text-zinc-900 dark:text-white font-bold w-6 text-center">{cantidad}</span>
                <button
                  onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAgregar}
                className={`w-full py-4 rounded-xl font-black text-lg transition flex items-center justify-center gap-2 ${
                  agregado
                    ? "bg-green-600 text-white"
                    : "bg-green-400 text-black hover:bg-green-300"
                }`}
              >
                <ShoppingCart size={20} />
                {agregado ? "Agregado al carrito" : "Añadir al carrito"}
              </button>
              <button className="w-full py-4 rounded-xl font-bold text-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-2">
                <Zap size={20} />
                Comprar ahora
              </button>
              <button
                onClick={() => toggleWishlist(producto)}
                className={`w-full py-3 rounded-xl font-medium text-sm border transition flex items-center justify-center gap-2 ${
                  enWishlist
                    ? "border-green-400 text-green-400 hover:bg-green-400/10"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <Heart size={16} className={enWishlist ? "fill-green-400" : ""} />
                {enWishlist ? "En favoritos" : "Agregar a favoritos"}
              </button>
            </div>

            {/* Sellos */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Lock size={20} />, label: "Pago seguro" },
                { icon: <Truck size={20} />, label: "Envío rápido" },
                { icon: <Shield size={20} />, label: "Garantía" },
              ].map((sello) => (
                <div
                  key={sello.label}
                  className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex flex-col items-center gap-1 text-center"
                >
                  <span className="text-green-400">{sello.icon}</span>
                  <span className="text-zinc-500 text-xs">{sello.label}</span>
                </div>
              ))}
            </div>

            {/* Políticas */}
            <div className="flex gap-4 text-xs text-zinc-400">
              <button className="hover:text-green-400 transition">Política de devoluciones</button>
              <span>·</span>
              <button className="hover:text-green-400 transition">Información de envío</button>
              <span>·</span>
              <button className="hover:text-green-400 transition">Preguntas frecuentes</button>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-16 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Descripción</h2>
          <p className="text-zinc-500 leading-relaxed">{producto.descripcion}</p>
        </div>

      </div>
    </div>
  )
}