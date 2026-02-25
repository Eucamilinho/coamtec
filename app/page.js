"use client"

import { useProductos } from "./store/productosStore"
import BotonCarrito from "./components/BotonCarrito"
import Link from "next/link"

export default function Home() {
  const productos = useProductos((state) => state.productos)
  const destacados = productos.slice(0, 4)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Hero */}
      <section className="relative overflow-hidden px-8 py-28 flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#22c55e20_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <span className="text-green-400 text-sm font-mono tracking-widest uppercase border border-green-400/30 px-4 py-1 rounded-full">
            Accesorios Gamer Premium
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            COAM
            <span className="text-green-400"> TEC</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
            Teclados, mouse, micrófonos y audífonos para llevar tu setup al siguiente nivel.
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              href="/productos"
              className="bg-green-400 text-black font-bold px-8 py-3 rounded-lg hover:bg-green-300 transition"
            >
              Ver productos
            </Link>
            <Link
              href="/productos"
              className="border border-zinc-700 text-zinc-300 font-medium px-8 py-3 rounded-lg hover:border-green-400 hover:text-green-400 transition"
            >
              Ver categorías
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="px-8 py-16">
        <h2 className="text-2xl font-bold text-zinc-100 mb-8 text-center">
          Categorías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {["Teclados", "Mouse", "Audífonos", "Micrófonos"].map((cat) => (
            <Link
              key={cat}
              href="/productos"
              className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-green-400 transition"
            >
              <span className="text-3xl">
                {cat === "Teclados" ? "⌨️" : cat === "Mouse" ? "🖱️" : cat === "Audífonos" ? "🎧" : "🎙️"}
              </span>
              <span className="text-zinc-300 font-medium group-hover:text-green-400 transition">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="px-8 py-16 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-100">
              Productos <span className="text-green-400">Destacados</span>
            </h2>
            <Link
              href="/productos"
              className="text-green-400 text-sm hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destacados.map((producto) => {
              const precioFinal = producto.descuento > 0
                ? producto.precio - (producto.precio * producto.descuento) / 100
                : producto.precio

              return (
                <div
                  key={producto.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative hover:border-green-400/50 transition group"
                >
                  {producto.descuento > 0 && (
                    <span className="absolute top-2 right-2 bg-green-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                      -{producto.descuento}%
                    </span>
                  )}
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="rounded-lg w-full object-cover"
                  />
                  <span className="text-xs text-green-400 font-mono">
                    {producto.categoria}
                  </span>
                  <h3 className="text-zinc-100 font-semibold">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm text-zinc-500">{producto.descripcion}</p>
                  <div className="flex flex-col">
                    {producto.descuento > 0 && (
                      <span className="text-xs text-zinc-600 line-through">
                        ${Number(producto.precio).toLocaleString()}
                      </span>
                    )}
                    <span className="text-xl font-bold text-green-400">
                      ${precioFinal.toLocaleString()}
                    </span>
                  </div>
                  <BotonCarrito producto={{ ...producto, precio: precioFinal }} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="px-8 py-20 flex flex-col items-center text-center gap-6">
        <h2 className="text-4xl font-black tracking-tight">
          Equipa tu setup.<br />
          <span className="text-green-400">Domina el juego.</span>
        </h2>
        <p className="text-zinc-400 max-w-md">
          Envíos a todo Colombia. Garantía en todos los productos. Paga con tarjeta, PSE o contra entrega.
        </p>
        <Link
          href="/productos"
          className="bg-green-400 text-black font-bold px-10 py-3 rounded-lg hover:bg-green-300 transition"
        >
          Comprar ahora
        </Link>
      </section>

    </main>
  )
}