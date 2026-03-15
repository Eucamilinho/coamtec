"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrito } from "../store/carritoStore";
import { useWishlist } from "../store/wishlistStore";
import { useCompraRapida } from "../store/compraRapidaStore";
import { getProductUrl } from "../lib/slugs";
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
  AlertTriangle,
  Package,
  Check,
  ArrowLeft,
  CreditCard,
  Play,
  Info,
} from "lucide-react";

export default function DetalleProductoClient({ producto, relacionados = [] }) {
  const { agregarProducto, puedeAgregarProducto, items } = useCarrito();
  const { items: wishlistItems, toggleWishlist } = useWishlist();
  const setCompraRapida = useCompraRapida((store) => store.setItems);

  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stockError, setStockError] = useState(null);
  const [agregadoAnimacion, setAgregadoAnimacion] = useState(false);
  const [tabActivo, setTabActivo] = useState("descripcion");

  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const enWishlist = mounted && wishlistItems.some((item) => item.id === producto?.id);

  // Información de stock
  const enCarrito = items.find(item => item.id === producto?.id);
  const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;
  const stockDisponible = (producto?.stock || 0) - cantidadEnCarrito;
  const tieneStock = producto?.stock && producto.stock > 0;
  const stockSuficiente = stockDisponible >= cantidad;

  const cantidadMaxima = Math.min(stockDisponible, 10);

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
    if (!tieneStock) {
      setStockError("Producto sin stock");
      setTimeout(() => setStockError(null), 3000);
      return;
    }
    
    if (!stockSuficiente) {
      setStockError(`Solo quedan ${stockDisponible} unidades disponibles`);
      setTimeout(() => setStockError(null), 3000);
      return;
    }

    for (let index = 0; index < cantidad; index += 1) {
      const verificacion = puedeAgregarProducto(producto);
      if (!verificacion.puede) {
        if (index === 0) {
          setStockError(verificacion.razon);
          setTimeout(() => setStockError(null), 3000);
        }
        break;
      }
      agregarProducto({ ...producto, precio: precioFinal });
    }
    
    setAgregadoAnimacion(true);
    setTimeout(() => setAgregadoAnimacion(false), 2000);
  };

  const cambiarImagen = (index) => setImagenActiva(index);

  const irAnterior = () => {
    setImagenActiva((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const irSiguiente = () => {
    setImagenActiva((prev) => (prev + 1) % imagenes.length);
  };

  // Verificar si hay video
  const tieneVideo = producto.video || producto.video_url;
  const videoUrl = producto.video || producto.video_url || "";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-20">
      {/* Modal de galería */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={() => setModalAbierto(false)}
        >
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition"
            >
              <X size={20} />
              <span className="text-sm font-medium">Cerrar</span>
            </button>
            <span className="text-white/60 text-sm">{imagenActiva + 1} / {imagenes.length}</span>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); irAnterior(); }}
            className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <ChevronLeft size={24} />
          </button>

          <Image
            src={imagenes[imagenActiva]}
            alt={producto.nombre}
            width={900}
            height={900}
            unoptimized
            className="max-h-[85vh] max-w-4xl rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); irSiguiente(); }}
            className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm">
          <Link href="/productos" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition flex items-center gap-1">
            <ArrowLeft size={14} />
            Productos
          </Link>
          <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-700" />
          <span className="text-zinc-900 dark:text-white font-medium truncate max-w-[200px]">{producto.nombre}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Columna izquierda: Galería + Video */}
          <section className="space-y-6">
            {/* Galería principal */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div
                className="group relative aspect-square overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 cursor-zoom-in shadow-sm"
                onClick={() => setModalAbierto(true)}
              >
                {producto.descuento > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-full">
                      -{producto.descuento}% OFF
                    </span>
                  </div>
                )}
                
                <Image
                  src={imagenes[imagenActiva]}
                  alt={producto.nombre}
                  width={900}
                  height={900}
                  priority
                  unoptimized
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                
                {/* Navegación en hover */}
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); irAnterior(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronLeft size={20} className="text-zinc-700 dark:text-zinc-300" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); irSiguiente(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronRight size={20} className="text-zinc-700 dark:text-zinc-300" />
                    </button>
                  </>
                )}
                
                {/* Zoom hint */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <ZoomIn size={14} />
                  Ampliar
                </div>
              </div>

              {/* Miniaturas */}
              {imagenes.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto pb-2 -mx-2 px-2">
                  {imagenes.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      onClick={() => cambiarImagen(index)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all flex-shrink-0 ${
                        index === imagenActiva 
                          ? "ring-2 ring-zinc-900 dark:ring-white ring-offset-2 dark:ring-offset-zinc-950" 
                          : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      <Image src={img} alt="" fill unoptimized className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sección de Video */}
            {tieneVideo ? (
              <div className="rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <div className="aspect-video relative">
                  {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={imagenes[0]}
                    />
                  )}
                </div>
              </div>
            ) : (
              // Placeholder de video cuando no hay video
              <div className="rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Play size={24} className="text-zinc-400 dark:text-zinc-500 ml-1" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  Video del producto próximamente
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Estamos preparando contenido exclusivo para ti
                </p>
              </div>
            )}

            {/* Beneficios visuales */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, title: "Envío Express", desc: "2-5 días" },
                { icon: Shield, title: "Garantía", desc: "12 meses" },
                { icon: RotateCcw, title: "Devolución", desc: "30 días" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 text-center">
                  <Icon size={22} className="mx-auto text-zinc-400 dark:text-zinc-500 mb-2" />
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">{title}</p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Columna derecha: Info del producto */}
          <section className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {producto.categoria && (
                    <span className="inline-block text-[11px] font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                      {producto.categoria}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
                    {producto.nombre}
                  </h1>
                </div>
              </div>

              {/* Rating y reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">4.8</span>
                <span className="text-sm text-zinc-400 dark:text-zinc-500">·</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">127 reseñas</span>
              </div>
            </div>

            {/* Precio y stock */}
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 space-y-5">
              {/* Precio */}
              <div className="flex items-end gap-3 flex-wrap">
                <p className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  ${precioFinal.toLocaleString()}
                </p>
                {producto.descuento > 0 && (
                  <>
                    <p className="text-lg text-zinc-400 line-through">
                      ${Number(producto.precio).toLocaleString()}
                    </p>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                      Ahorras ${ahorro.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${tieneStock ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                  <span className={`text-sm font-medium ${tieneStock ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {tieneStock ? 'En stock' : 'Agotado'}
                  </span>
                  {tieneStock && (
                    <span className="text-sm text-zinc-400 dark:text-zinc-500">
                      · {producto.stock} unidades
                    </span>
                  )}
                </div>
                {cantidadEnCarrito > 0 && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                    {cantidadEnCarrito} en tu carrito
                  </span>
                )}
              </div>

              {/* Error */}
              {stockError && (
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-xl px-4 py-3">
                  <AlertTriangle size={16} />
                  <span>{stockError}</span>
                </div>
              )}

              {/* Cantidad y botones */}
              {tieneStock && stockDisponible > 0 ? (
                <>
                  {/* Selector de cantidad */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Cantidad</span>
                    <div className="flex items-center bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      <button
                        onClick={() => setCantidad((v) => Math.max(1, v - 1))}
                        disabled={cantidad <= 1}
                        className={`w-11 h-11 flex items-center justify-center rounded-full transition ${
                          cantidad <= 1 ? 'text-zinc-300 dark:text-zinc-600' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        <Minus size={16} strokeWidth={2.5} />
                      </button>
                      <span className="w-14 text-center font-semibold text-zinc-900 dark:text-white text-lg">
                        {cantidad}
                      </span>
                      <button
                        onClick={() => setCantidad((v) => Math.min(cantidadMaxima, v + 1))}
                        disabled={cantidad >= cantidadMaxima}
                        className={`w-11 h-11 flex items-center justify-center rounded-full transition ${
                          cantidad >= cantidadMaxima ? 'text-zinc-300 dark:text-zinc-600' : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                    {cantidadMaxima < 10 && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        Máx: {cantidadMaxima}
                      </span>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={agregarAlCarrito}
                      className={`h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                        agregadoAnimacion
                          ? 'bg-green-500 text-white'
                          : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                      }`}
                    >
                      {agregadoAnimacion ? (
                        <>
                          <Check size={20} strokeWidth={2.5} />
                          ¡Agregado!
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          Añadir al carrito
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (!stockSuficiente) return;
                        setCompraRapida([{ ...producto, precio: precioFinal, cantidad }]);
                        router.push("/checkout/rapido");
                      }}
                      disabled={!stockSuficiente}
                      className={`h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                        stockSuficiente
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      <Zap size={18} />
                      Comprar ahora
                    </button>
                  </div>

                  {/* Botón favoritos */}
                  <button
                    onClick={() => toggleWishlist(producto)}
                    className={`w-full h-12 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all border-2 ${
                      enWishlist
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} className={enWishlist ? 'fill-current' : ''} />
                    {enWishlist ? 'En favoritos' : 'Agregar a favoritos'}
                  </button>
                </>
              ) : (
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                    <Package size={22} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">Producto agotado</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Suscríbete para ser notificado</p>
                  </div>
                </div>
              )}
            </div>

            {/* Métodos de pago */}
            <div className="flex items-center justify-center gap-4 py-2">
              <CreditCard size={20} className="text-zinc-300 dark:text-zinc-600" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                Nequi · Daviplata · Visa · Mastercard
              </span>
            </div>

            {/* Tabs de información */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
              {/* Tab headers */}
              <div className="flex gap-1 mb-4 overflow-x-auto">
                {[
                  { id: 'descripcion', label: 'Descripción' },
                  { id: 'especificaciones', label: 'Especificaciones' },
                  { id: 'envio', label: 'Envío' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActivo(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition ${
                      tabActivo === tab.id
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5">
                {tabActivo === 'descripcion' && (
                  <div className="space-y-4">
                    <div
                      className="prose prose-sm max-w-none text-zinc-600 dark:text-zinc-400 prose-p:my-2 prose-p:leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: producto.descripcion || "Descripción no disponible.",
                      }}
                    />
                    {producto.caracteristicas && producto.caracteristicas.length > 0 && (
                      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Características principales</p>
                        <ul className="space-y-2">
                          {producto.caracteristicas.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                              <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {tabActivo === 'especificaciones' && (
                  <div className="space-y-3">
                    {producto.caracteristicas && producto.caracteristicas.length > 0 ? (
                      producto.caracteristicas.map((c, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">Especificación {i + 1}</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">{c}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Info size={24} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                        <p className="text-sm text-zinc-400 dark:text-zinc-500">Especificaciones no disponibles</p>
                      </div>
                    )}
                  </div>
                )}

                {tabActivo === 'envio' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Truck size={18} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Envío a todo Colombia</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Entrega estimada: 2 a 5 días hábiles</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <RotateCcw size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Devolución gratuita</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Tienes 30 días para devolverlo</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Shield size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Garantía de 12 meses</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Respaldo total en tu compra</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Productos relacionados */}
        {relacionados.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">También te puede interesar</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Productos similares en nuestra tienda</p>
              </div>
              <Link href="/productos" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition flex items-center gap-1">
                Ver todo
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relacionados.map((item) => {
                const precioItem = item.descuento > 0
                  ? item.precio - (item.precio * item.descuento) / 100
                  : item.precio;

                return (
                  <Link key={item.id} href={getProductUrl(item)} className="group">
                    <article className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 overflow-hidden transition-all hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          unoptimized
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                        {item.descuento > 0 && (
                          <span className="absolute top-3 left-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold px-2 py-1 rounded-full">
                            -{item.descuento}%
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-white leading-snug">
                          {item.nombre}
                        </p>
                        <div className="flex items-baseline gap-2 mt-2">
                          <p className="text-lg font-bold text-zinc-900 dark:text-white">
                            ${precioItem.toLocaleString()}
                          </p>
                          {item.descuento > 0 && (
                            <p className="text-xs text-zinc-400 line-through">
                              ${item.precio.toLocaleString()}
                            </p>
                          )}
                        </div>
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
