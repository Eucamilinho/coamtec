"use client"

import { useState, use } from "react"
import { useProductos } from "../../store/productosStore"
import { useCarrito } from "../../store/carritoStore"
import { useWishlist } from "../../store/wishlistStore"
import Link from "next/link"
import { ShoppingCart, Heart, Zap, Star, Shield, Truck, RotateCcw, Lock, ChevronRight, Minus, Plus, X, ChevronLeft, ZoomIn } from "lucide-react"
import { useRouter } from "next/navigation"


export default function DetalleProducto({ params }) {
  const { id } = use(params)
  const productos = useProductos((state) => state.productos)
  const agregarProducto = useCarrito((state) => state.agregarProducto)
  const { items: wishlistItems, toggleWishlist } = useWishlist()
  const producto = productos.find((p) => p.id === Number(id))
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const [imagenActiva, setImagenActiva] = useState(0)
  const [modalAbierto, setModalAbierto] = useState(false)
  const enWishlist = wishlistItems.some((p) => p.id === producto?.id)
  const router = useRouter()

  if (!producto) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">Producto no encontrado</h1>
          <Link href="/productos" className="text-green-400 hover:underline">Volver a productos</Link>
        </div>
      </div>
    )
  }

  // Construir array de imágenes
const todasLasImagenes = (producto.imagenes && producto.imagenes.length > 0)
  ? producto.imagenes.filter(Boolean)
  : [producto.imagen].filter(Boolean)

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

  

  const irAnterior = () => setImagenActiva((prev) => (prev - 1 + todasLasImagenes.length) % todasLasImagenes.length)
  const irSiguiente = () => setImagenActiva((prev) => (prev + 1) % todasLasImagenes.length)

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
            onClick={(e) => { e.stopPropagation(); irAnterior() }}
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
            onClick={(e) => { e.stopPropagation(); irSiguiente() }}
            className="absolute right-4 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          {/* Dots modal */}
          <div className="absolute bottom-6 flex gap-2">
            {todasLasImagenes.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setImagenActiva(i) }}
                className={`rounded-full transition-all ${i === imagenActiva ? "w-6 h-2 bg-green-400" : "w-2 h-2 bg-zinc-600 hover:bg-zinc-400"}`}
              />
            ))}
          </div>
        </div>
      )}

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

            {/* Imagen principal */}
            <div
              className="relative bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center cursor-zoom-in group"
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
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {/* Hint zoom */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <ZoomIn size={12} />
                Click para ampliar
              </div>

              {/* Flechas navegación */}
              <button
                onClick={(e) => { e.stopPropagation(); irAnterior() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-zinc-800/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={16} className="text-zinc-700 dark:text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); irSiguiente() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-zinc-800/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={16} className="text-zinc-700 dark:text-white" />
              </button>
            </div>

            {/* Miniaturas */}
            <div className="flex gap-3">
              {todasLasImagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagenActiva(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                    i === imagenActiva
                      ? "border-green-400"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-green-400/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`vista ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
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

            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-zinc-500 text-sm">4.8 · 124 opiniones</span>
            </div>

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

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${producto.stock > 3 ? "bg-green-400" : "bg-red-500"}`} />
              <span className="text-sm text-zinc-500">
                {producto.stock > 3
                  ? `${producto.stock} unidades disponibles`
                  : `⚡ Solo quedan ${producto.stock} unidades`}
              </span>
            </div>

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

            <div className="flex items-center gap-4">
              <span className="text-zinc-500 text-sm">Cantidad:</span>
              <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
                  <Minus size={16} />
                </button>
                <span className="text-zinc-900 dark:text-white font-bold w-6 text-center">{cantidad}</span>
                <button onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
  {producto.stock === 0 ? (
    <>
      <button
        disabled
        className="w-full py-4 rounded-xl font-black text-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed flex items-center justify-center gap-2"
      >
        <ShoppingCart size={20} />
        Sin stock
      </button>
      <p className="text-center text-zinc-500 text-sm">
        Este producto está agotado actualmente
      </p>
    </>
  ) : (
    <>
      <button
        onClick={handleAgregar}
        className={`w-full py-4 rounded-xl font-black text-lg transition flex items-center justify-center gap-2 ${
          agregado ? "bg-green-600 text-white" : "bg-green-400 text-black hover:bg-green-300"
        }`}
      >
        <ShoppingCart size={20} />
        {agregado ? "Agregado al carrito" : "Añadir al carrito"}
      </button>
      <button
  onClick={() => {
    handleAgregar()
    router.push("/checkout")
  }}
  className="w-full py-4 rounded-xl font-bold text-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-2"
>
  <Zap size={20} />
  Comprar ahora
</button>
    </>
  )}
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

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Lock size={20} />, label: "Pago seguro" },
                { icon: <Truck size={20} />, label: "Envío rápido" },
                { icon: <Shield size={20} />, label: "Garantía" },
              ].map((sello) => (
                <div key={sello.label} className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex flex-col items-center gap-1 text-center">
                  <span className="text-green-400">{sello.icon}</span>
                  <span className="text-zinc-500 text-xs">{sello.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 text-xs text-zinc-400">
              <button className="hover:text-green-400 transition">Política de devoluciones</button>
              <span>·</span>
              <button className="hover:text-green-400 transition">Información de envío</button>
              <span>·</span>
              <button className="hover:text-green-400 transition">Preguntas frecuentes</button>
            </div>
          </div>
        </div>

                {/* Botón TikTok solo en móvil */}
{producto.video_tiktok && (
  <a
    href={producto.video_tiktok}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-6 md:hidden flex items-center justify-center gap-3 w-full bg-black border border-zinc-700 text-white font-bold py-4 rounded-xl hover:bg-zinc-900 transition"
  >
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
    <span>Ver video del producto en TikTok</span>
  </a>
)}

        {/* Video TikTok flotante */}
        {producto.video_tiktok && (
          <VideoTikTok url={producto.video_tiktok} />
          
        )}

        

        <div className="mt-16 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Descripción</h2>
          <p className="text-zinc-500 leading-relaxed">{producto.descripcion}</p>
        </div>

      </div>
    </div>

    
  )

  
}

function VideoTikTok({ url }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      {/* Pestaña flotante */}
      <div
  className={`hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
    abierto ? "translate-x-0" : "translate-x-[calc(100%-44px)]"
  }`}
  style={{ width: "280px" }}
>
        {/* Botón pestaña */}
        <button
          onClick={() => setAbierto(!abierto)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-zinc-900 border border-zinc-700 border-r-0 rounded-l-2xl px-3 py-8 flex flex-col items-center gap-3 hover:bg-zinc-800 transition shadow-2xl"
        >
          <span className="text-xl">🎵</span>
          <span
            className="text-green-400 text-xs font-black tracking-widest uppercase"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {abierto ? "Cerrar" : "TikTok"}
          </span>
        </button>

        {/* Panel */}
        <div className="bg-zinc-950 border-l border-t border-b border-zinc-800 rounded-l-3xl p-5 shadow-2xl flex flex-col items-center gap-4">

          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-white font-black text-sm">Video del producto</p>
              <p className="text-zinc-500 text-xs">Míralo en TikTok</p>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition text-zinc-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          {/* Desktop - embed */}
          <div className="hidden md:block w-full">
            <div
              className="relative overflow-hidden rounded-2xl bg-black shadow-2xl w-full"
              style={{ height: "480px" }}
            >
              {abierto && (
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${url.split("/video/")[1]?.split("?")[0]}`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay"
                  style={{ border: "none" }}
                />
              )}
            </div>
          </div>

          {/* Mobile - solo logo y link */}
          <div className="md:hidden flex flex-col items-center gap-5 py-6 w-full">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center shadow-xl border border-zinc-800">
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm mb-1">Ver en TikTok</p>
              <p className="text-zinc-500 text-xs">Toca el botón para ver el video del producto</p>
            </div>
            
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-black border border-zinc-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-900 transition"
            <a>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
              </svg>
              Abrir en TikTok
            </a>
          </div>

        </div>
      </div>

      {/* Overlay */}
      {abierto && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setAbierto(false)}
        />
      )}
    </>
  )
}