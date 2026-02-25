"use client"

import { useEffect } from "react"
import { useProductos } from "../store/productosStore"
import BotonCarrito from "../components/BotonCarrito"
import Link from "next/link"

export default function Productos() {
  const { productos, cargando, cargarProductos } = useProductos()

  useEffect(() => {
    cargarProductos()
  }, [])

  if (cargando) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-green-400 font-mono animate-pulse">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <h1 className="text-3xl font-black text-white mb-8">
        Nuestros <span className="text-green-400">Productos</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productos.map((producto) => {
          const precioFinal = producto.descuento > 0
            ? producto.precio - (producto.precio * producto.descuento) / 100
            : producto.precio

          return (
            <div
              key={producto.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative hover:border-green-400/50 transition"
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
              <Link href={`/productos/${producto.id}`}>
                <h2 className="text-lg font-semibold text-zinc-100 hover:text-green-400 transition">
                  {producto.nombre}
                </h2>
              </Link>
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
  )
}