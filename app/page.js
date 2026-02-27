"use client";

import { useEffect, useRef, useState } from "react";
import { useProductos } from "./store/productosStore";
import Link from "next/link";
import BotonCarrito from "./components/BotonCarrito";
import {
  ArrowRight,
  Shield,
  Truck,
  Star,
  Keyboard,
  Mouse,
  Headphones,
  Mic,
  Zap,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { useCarrito } from "./store/carritoStore";

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

const PARTICULAS = [
  { left: "10%", top: "20%", dur: 3.5, delay: 0 },
  { left: "20%", top: "80%", dur: 4.2, delay: 0.5 },
  { left: "30%", top: "40%", dur: 3.8, delay: 1 },
  { left: "40%", top: "60%", dur: 5.1, delay: 0.3 },
  { left: "50%", top: "15%", dur: 4.0, delay: 0.8 },
  { left: "60%", top: "75%", dur: 3.3, delay: 1.2 },
  { left: "70%", top: "35%", dur: 4.7, delay: 0.2 },
  { left: "80%", top: "55%", dur: 3.9, delay: 0.7 },
  { left: "90%", top: "25%", dur: 4.4, delay: 1.5 },
  { left: "15%", top: "90%", dur: 3.6, delay: 0.4 },
  { left: "25%", top: "50%", dur: 5.0, delay: 0.9 },
  { left: "35%", top: "10%", dur: 4.1, delay: 1.1 },
  { left: "45%", top: "70%", dur: 3.7, delay: 0.6 },
  { left: "55%", top: "45%", dur: 4.8, delay: 1.3 },
  { left: "65%", top: "85%", dur: 3.4, delay: 0.1 },
  { left: "75%", top: "30%", dur: 4.5, delay: 1.4 },
  { left: "85%", top: "65%", dur: 3.2, delay: 0.8 },
  { left: "5%", top: "55%", dur: 4.3, delay: 0.3 },
  { left: "95%", top: "40%", dur: 3.1, delay: 1.0 },
  { left: "50%", top: "95%", dur: 4.6, delay: 0.5 },
];

function Particulas() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICULAS.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-green-400 rounded-full opacity-20"
          style={{
            left: p.left,
            top: p.top,
            animation: `flotar ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const productos = useProductos((state) => state.productos);
  const [heroRef, heroInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [productosRef, productosInView] = useInView();
  const [bannerRef, bannerInView] = useInView();
  const [catRef, catInView] = useInView();
  const [indiceCarousel, setIndiceCarousel] = useState(0);

  useEffect(() => {
    if (productos.length === 0) return;
    const interval = setInterval(() => {
      setIndiceCarousel((prev) => (prev + 1) % productos.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [productos.length]);

  const precioFinal = (p) => {
    if (!p || !p.precio) return 0;
    return p.descuento > 0
      ? p.precio - (p.precio * p.descuento) / 100
      : p.precio;
  };

  const productoActual = productos[indiceCarousel];

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-x-hidden">
      <style>{`
        @keyframes flotar {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(74, 222, 128, 0); }
        }
        .animate-slide-in { animation: slideIn 0.7s ease forwards; }
        .animate-slide-left { animation: slideInLeft 0.7s ease forwards; }
        .animate-slide-right { animation: slideInRight 0.7s ease forwards; }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .opacity-0-init { opacity: 0; }
      `}</style>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_#22c55e18_0%,_transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:50px_50px]" />
        <Particulas />

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          {/* Texto */}
          <div ref={heroRef} className="flex flex-col gap-8">
            <div
              className={`opacity-0-init ${heroInView ? "animate-slide-in" : ""}`}
            >
              <span className="inline-flex items-center gap-2 text-green-400 text-xs font-mono tracking-widest uppercase border border-green-400/30 bg-green-400/5 px-4 py-2 rounded-full">
                <span
                  className="w-2 h-2 bg-green-400 rounded-full"
                  style={{ animation: "pulseGreen 2s infinite" }}
                />
                Accesorios Gamer Premium · Colombia
              </span>
            </div>

            <div
              className={`opacity-0-init ${heroInView ? "animate-slide-in delay-100" : ""}`}
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
                ELEVA
                <br />
                <span className="text-green-400">TU SETUP</span>
              </h1>
            </div>

            <p
              className={`text-zinc-400 text-lg leading-relaxed max-w-md opacity-0-init ${heroInView ? "animate-slide-in delay-200" : ""}`}
            >
              Teclados mecánicos, mouse de precisión, micrófonos y audífonos
              gamer. Todo lo que necesitas para dominar.
            </p>

            <div
              className={`flex gap-4 flex-wrap opacity-0-init ${heroInView ? "animate-slide-in delay-300" : ""}`}
            >
              <Link
                href="/productos"
                className="group bg-green-400 text-black font-black px-8 py-4 rounded-xl hover:bg-green-300 transition flex items-center gap-2 text-base"
              >
                Ver catálogo
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/productos"
                className="border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-medium px-8 py-4 rounded-xl hover:border-green-400 hover:text-green-400 transition text-base"
              >
                Ofertas del día
              </Link>
            </div>

            <div
              className={`grid grid-cols-3 gap-6 pt-4 opacity-0-init ${heroInView ? "animate-slide-in delay-400" : ""}`}
            >
              {[
                { num: `${productos.length}+`, label: "Productos" },
                { num: "24h", label: "Envío express" },
                { num: "100%", label: "Garantía" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="border-l border-zinc-300 dark:border-zinc-800 pl-4"
                >
                  <p className="text-2xl font-black text-green-400">{s.num}</p>
                  <p className="text-zinc-500 dark:text-zinc-500 text-xs mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel */}
          {productoActual && (
            <div
              className={`relative opacity-0-init ${heroInView ? "animate-slide-right delay-200" : ""}`}
            >
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#22c55e08_0%,_transparent_60%)] pointer-events-none" />

                {/* Badge descuento */}
                {productoActual.descuento > 0 && (
                  <span className="absolute top-4 left-4 z-10 bg-green-400 text-black text-xs font-black px-3 py-1 rounded-full pointer-events-none">
                    -{productoActual.descuento}% OFF
                  </span>
                )}

                {/* Imagen */}
                <Link href={`/productos/${productoActual.id}`}>
                  <div className="relative overflow-hidden rounded-2xl bg-zinc-800 aspect-square cursor-pointer">
                    <img
                      src={productoActual.imagen}
                      alt={productoActual.nombre}
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="relative z-10 mt-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-green-400 font-mono text-xs tracking-widest uppercase">
                        {productoActual.categoria}
                      </span>
                      <Link href={`/productos/${productoActual.id}`}>
                        <h3 className="text-white font-black text-xl leading-tight mt-1 hover:text-green-400 transition">
                          {productoActual.nombre}
                        </h3>
                      </Link>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {productoActual.descuento > 0 && (
                        <p className="text-zinc-600 line-through text-sm">
                          ${Number(productoActual.precio).toLocaleString()}
                        </p>
                      )}
                      <p className="text-green-400 font-black text-2xl">
                        ${precioFinal(productoActual).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={12}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                    <span className="text-zinc-500 text-xs ml-1">4.8</span>
                  </div>

                  {productoActual.stock === 0 ? (
  <button
    disabled
    className="relative z-10 w-full bg-zinc-800 text-zinc-400 font-black py-3 rounded-xl cursor-not-allowed text-sm"
  >
    Sin stock
  </button>
) : (
  <button
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      const { agregarProducto } = useCarrito.getState()
      agregarProducto({
        ...productoActual,
        precio: precioFinal(productoActual),
      })
    }}
    className="relative z-10 w-full bg-green-400 text-black font-black py-3 rounded-xl hover:bg-green-300 transition flex items-center justify-center gap-2"
  >
    <ShoppingCart size={18} />
    Agregar al carrito
  </button>
)}
                </div>

                {/* Navegación carousel */}
                <div className="relative z-10 flex items-center justify-between mt-4">
                  <button
                    onClick={() =>
                      setIndiceCarousel(
                        (prev) =>
                          (prev - 1 + productos.length) % productos.length,
                      )
                    }
                    className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition"
                  >
                    <ChevronLeft size={16} className="text-zinc-400" />
                  </button>
                  <div className="flex gap-2">
                    {productos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndiceCarousel(i)}
                        className={`rounded-full transition-all ${
                          i === indiceCarousel
                            ? "w-6 h-2 bg-green-400"
                            : "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setIndiceCarousel((prev) => (prev + 1) % productos.length)
                    }
                    className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition"
                  >
                    <ChevronRight size={16} className="text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Badges flotantes */}
              {/* <div className="absolute -top-4 -right-4 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-2xl">
                <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                  <Zap size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Envío express</p>
                  <p className="text-zinc-500 text-xs">24 horas</p>
                </div>
              </div> */}
              {/* <div className="absolute -bottom-4 -left-4 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-2xl">
                <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Garantía real</p>
                  <p className="text-zinc-500 text-xs">12 meses</p>
                </div>
              </div> */}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
          <p className="text-xs font-mono tracking-widest uppercase">Scroll</p>
          <div className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <div className="bg-green-400 py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className="text-black font-black text-xs mx-8 tracking-widest uppercase flex items-center gap-3"
            >
              <Keyboard size={14} /> Teclados Mecánicos
              <span className="opacity-30 mx-2">•</span>
              <Mouse size={14} /> Mouse Gamer
              <span className="opacity-30 mx-2">•</span>
              <Headphones size={14} /> Audífonos 7.1
              <span className="opacity-30 mx-2">•</span>
              <Mic size={14} /> Micrófonos Pro
              <span className="opacity-30 mx-2">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════ CATEGORÍAS ═══════════════════ */}
      <section ref={catRef} className="px-8 py-20 max-w-7xl mx-auto">
        <div
          className={`text-center mb-12 opacity-0-init ${catInView ? "animate-slide-in" : ""}`}
        >
          <p className="text-green-400 font-mono text-xs tracking-widest uppercase mb-2">
            Explora
          </p>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white">
            Categorías
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Keyboard size={28} />,
              nombre: "Teclados",
              desc: "Mecánicos y membrana",
              color: "from-blue-500/10",
            },
            {
              icon: <Mouse size={28} />,
              nombre: "Mouse",
              desc: "Alta precisión",
              color: "from-purple-500/10",
            },
            {
              icon: <Headphones size={28} />,
              nombre: "Audífonos",
              desc: "Sonido inmersivo",
              color: "from-green-500/10",
            },
            {
              icon: <Mic size={28} />,
              nombre: "Micrófonos",
              desc: "Claridad de audio",
              color: "from-orange-500/10",
            },
          ].map((cat, i) => (
            <Link
              key={cat.nombre}
              href="/productos"
              className={`group bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-green-400 transition-all duration-300 hover:-translate-y-1 opacity-0-init ${catInView ? "animate-slide-in" : ""}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${cat.color} to-transparent rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-300 border border-zinc-200 dark:border-zinc-700`}
              >
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="text-zinc-800 dark:text-white font-bold group-hover:text-green-400 transition">
                  {cat.nombre}
                </p>
                <p className="text-zinc-500 text-xs mt-1">{cat.desc}</p>
              </div>
              <span className="text-green-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                Ver todos <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════ BANNER OFERTA ═══════════════════ */}
      <section className="px-8 py-6 max-w-7xl mx-auto">
        <div className="bg-zinc-950 dark:bg-zinc-900 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_#22c55e15_0%,_transparent_60%)]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-green-400 font-mono text-xs tracking-widest uppercase bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full w-fit">
                Oferta especial
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Hasta 30% OFF
                <br />
                <span className="text-green-400">en accesorios</span>
              </h2>
              <p className="text-zinc-400 max-w-sm">
                Aprovecha nuestras ofertas por tiempo limitado en los mejores
                accesorios gamer.
              </p>
            </div>
            <Link
              href="/productos"
              className="bg-green-400 text-black font-black px-10 py-4 rounded-xl hover:bg-green-300 transition text-lg flex-shrink-0 flex items-center gap-2"
            >
              Ver ofertas
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRODUCTOS DESTACADOS ═══════════════════ */}
      <section
        ref={productosRef}
        className="px-8 py-20 bg-zinc-50 dark:bg-zinc-900/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div
              className={`opacity-0-init ${productosInView ? "animate-slide-left" : ""}`}
            >
              <p className="text-green-400 font-mono text-xs tracking-widest uppercase mb-2">
                Lo más popular
              </p>
              <h2 className="text-4xl font-black text-zinc-900 dark:text-white">
                Productos <span className="text-green-400">destacados</span>
              </h2>
            </div>
            <Link
              href="/productos"
              className={`text-green-400 hover:underline text-sm flex items-center gap-1 opacity-0-init ${productosInView ? "animate-slide-right" : ""}`}
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.slice(0, 4).map((producto, i) => {
  const pf = precioFinal(producto)
  return (
    <div
      key={producto.id}
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group opacity-0-init ${
        productosInView ? "animate-slide-in" : ""
      } ${
        producto.stock === 0
          ? "opacity-70"
          : "hover:border-green-400/60 hover:shadow-lg dark:hover:shadow-green-400/5 hover:-translate-y-1"
      }`}
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 aspect-square">
        {producto.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="bg-zinc-900 border border-zinc-700 text-zinc-400 font-black px-4 py-2 rounded-full text-sm">
              Agotado
            </span>
          </div>
        )}
        {producto.stock > 0 && producto.descuento > 0 && (
          <span className="absolute top-3 left-3 bg-green-400 text-black text-xs font-black px-2 py-1 rounded-full z-10">
            -{producto.descuento}%
          </span>
        )}
        {producto.stock <= 3 && producto.stock > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            Últimas
          </span>
        )}
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-xs text-green-400 font-mono">{producto.categoria}</span>
        <Link href={`/productos/${producto.id}`}>
          <h3 className="text-zinc-800 dark:text-zinc-100 font-bold hover:text-green-400 transition leading-tight line-clamp-2">
            {producto.nombre}
          </h3>
        </Link>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((i) => (
            <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
          ))}
          <span className="text-zinc-400 text-xs ml-1">4.8</span>
        </div>
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div>
            {producto.descuento > 0 && (
              <span className="text-xs text-zinc-400 line-through block">
                ${Number(producto.precio).toLocaleString()}
              </span>
            )}
            <span className="text-xl font-black text-green-400">
              ${pf.toLocaleString()}
            </span>
          </div>
          {producto.stock === 0 ? (
            <button
              disabled
              className="w-full py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-sm font-medium cursor-not-allowed"
            >
              Sin stock
            </button>
          ) : (
            <BotonCarrito producto={{ ...producto, precio: pf }} />
          )}
        </div>
      </div>
    </div>
  )
})}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section ref={statsRef} className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              num: "500+",
              label: "Clientes felices",
              icon: <Star size={24} />,
            },
            { num: "24h", label: "Envío express", icon: <Truck size={24} /> },
            { num: "100%", label: "Garantía real", icon: <Shield size={24} /> },
            {
              num: "30 días",
              label: "Devoluciones",
              icon: <RotateCcw size={24} />,
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:border-green-400/50 transition opacity-0-init ${statsInView ? "animate-slide-in" : ""}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center text-green-400">
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-black text-green-400">{stat.num}</p>
                <p className="text-zinc-500 text-sm mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ BANNER FINAL ═══════════════════ */}
      <section ref={bannerRef} className="px-8 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#22c55e10_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <div
            className={`opacity-0-init ${bannerInView ? "animate-slide-in" : ""}`}
          >
            <p className="text-green-400 font-mono text-xs tracking-widest uppercase mb-4">
              Coam Tec
            </p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
              Equipa tu setup.
              <br />
              <span className="text-green-400">Domina el juego.</span>
            </h2>
          </div>
          <p
            className={`text-zinc-500 text-lg max-w-md opacity-0-init ${bannerInView ? "animate-slide-in delay-100" : ""}`}
          >
            Envíos a todo Colombia. Garantía en todos los productos. Paga con
            tarjeta, PSE o contra entrega.
          </p>
          <div
            className={`flex gap-4 flex-wrap justify-center opacity-0-init ${bannerInView ? "animate-slide-in delay-200" : ""}`}
          >
            <Link
              href="/productos"
              className="bg-green-400 text-black font-black px-10 py-4 rounded-xl hover:bg-green-300 transition text-lg flex items-center gap-2"
            >
              Comprar ahora <ArrowRight size={20} />
            </Link>
            <Link
              href="/productos"
              className="border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-10 py-4 rounded-xl hover:border-green-400 hover:text-green-400 transition text-lg"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-8 py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
              COAM<span className="text-green-400">TEC</span>
            </h3>
            <p className="text-zinc-500 text-sm mt-2 max-w-xs leading-relaxed">
              Los mejores accesorios gamer de Colombia. Teclados, mouse,
              audífonos y micrófonos para llevar tu setup al siguiente nivel.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: <Shield size={14} />, label: "Pagos seguros" },
                { icon: <Truck size={14} />, label: "Envío rápido" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700"
                >
                  <span className="text-green-400">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-zinc-800 dark:text-white font-bold text-sm mb-4">
              Tienda
            </h4>
            <div className="flex flex-col gap-2">
              {["Productos", "Ofertas", "Categorías", "Novedades"].map(
                (link) => (
                  <Link
                    key={link}
                    href="/productos"
                    className="text-zinc-500 hover:text-green-400 transition text-sm"
                  >
                    {link}
                  </Link>
                ),
              )}
            </div>
          </div>
          <div>
            <h4 className="text-zinc-800 dark:text-white font-bold text-sm mb-4">
              Ayuda
            </h4>
            <div className="flex flex-col gap-2">
              {["Envíos", "Devoluciones", "Garantía", "Contacto"].map(
                (link) => (
                  <Link
                    key={link}
                    href="/"
                    className="text-zinc-500 hover:text-green-400 transition text-sm"
                  >
                    {link}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-sm">
            © 2025 Coam Tec. Todos los derechos reservados.
          </p>
          <Link
            href="/admin"
            className="text-zinc-600 hover:text-green-400 transition text-xs"
          >
            Admin
          </Link>
        </div>
      </footer>
    </main>
  );
}
