"use client"

import { useEffect, useState } from "react"
import { useProductos } from "../store/productosStore"
import BotonCarrito from "../components/BotonCarrito"
import Link from "next/link"
import { Search, X, Grid, List } from "lucide-react"

export default function Productos() {
  const { productos, cargando, cargarProductos } = useProductos()
  const [busqueda, setBusqueda] = useState("")
  const [categoriaActiva, setCategoriaActiva] = useState("Todos")
  const [orden, setOrden] = useState("default")
  const [vista, setVista] = useState("grid")

  useEffect(() => {
    cargarProductos()
  }, [])

  const categorias = ["Todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))]

  const productosFiltrados = productos
    .filter((p) => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      const coincideCategoria = categoriaActiva === "Todos" || p.categoria === categoriaActiva
      return coincideBusqueda && coincideCategoria
    })
    .sort((a, b) => {
      if (orden === "precio-asc") return a.precio - b.precio
      if (orden === "precio-desc") return b.precio - a.precio
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre)
      if (orden === "descuento") return b.descuento - a.descuento
      return 0
    })

  if (cargando) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-green-400 font-mono animate-pulse">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-20">

      {/* Header */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black mb-2">
            Nuestros <span className="text-green-400">Productos</span>
          </h1>
          <p className="text-zinc-500 text-sm">{productosFiltrados.length} productos encontrados</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Controles */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* Buscador */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 pl-10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-green-400 transition"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Ordenar */}
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-green-400 transition cursor-pointer"
          >
            <option value="default">Ordenar por</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A-Z</option>
            <option value="descuento">Mayor descuento</option>
          </select>

          {/* Vista */}
          <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setVista("grid")}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2 ${
                vista === "grid"
                  ? "bg-green-400 text-black"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Grid size={16} /> Grid
            </button>
            <button
              onClick={() => setVista("lista")}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2 ${
                vista === "lista"
                  ? "bg-green-400 text-black"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <List size={16} /> Lista
            </button>
          </div>
        </div>

        {/* Categorías */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                categoriaActiva === cat
                  ? "bg-green-400 text-black"
                  : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-green-400 hover:text-green-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sin resultados */}
        {productosFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Search size={48} className="text-zinc-300 dark:text-zinc-700" />
            <p className="text-zinc-400 text-lg">No encontramos productos con esa búsqueda</p>
            <button
              onClick={() => { setBusqueda(""); setCategoriaActiva("Todos") }}
              className="text-green-400 hover:underline text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Vista Grid */}
        {vista === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => {
              const precioFinal = producto.descuento > 0
                ? producto.precio - (producto.precio * producto.descuento) / 100
                : producto.precio

              return (
                <div
                  key={producto.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative hover:border-green-400/50 transition group"
                >
                  {producto.descuento > 0 && (
                    <span className="absolute top-3 right-3 bg-green-400 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                      -{producto.descuento}%
                    </span>
                  )}
                  {producto.stock <= 3 && producto.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      ⚡ Últimas
                    </span>
                  )}
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <span className="text-xs text-green-400 font-mono">{producto.categoria}</span>
                  <Link href={`/productos/${producto.id}`}>
                    <h2 className="text-zinc-800 dark:text-zinc-100 font-semibold hover:text-green-400 transition leading-tight">
                      {producto.nombre}
                    </h2>
                  </Link>
                  <p className="text-sm text-zinc-500 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex flex-col mt-auto">
                    {producto.descuento > 0 && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-600 line-through">
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
        )}

        {/* Vista Lista */}
        {vista === "lista" && (
          <div className="flex flex-col gap-4">
            {productosFiltrados.map((producto) => {
              const precioFinal = producto.descuento > 0
                ? producto.precio - (producto.precio * producto.descuento) / 100
                : producto.precio

              return (
                <div
                  key={producto.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-6 items-center hover:border-green-400/50 transition group"
                >
                  <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-green-400 font-mono">{producto.categoria}</span>
                    <Link href={`/productos/${producto.id}`}>
                      <h2 className="text-zinc-800 dark:text-zinc-100 font-semibold text-lg hover:text-green-400 transition">
                        {producto.nombre}
                      </h2>
                    </Link>
                    <p className="text-sm text-zinc-500 mt-1">{producto.descripcion}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {producto.stock <= 3 && producto.stock > 0 && (
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                          ⚡ Últimas unidades
                        </span>
                      )}
                      {producto.descuento > 0 && (
                        <span className="bg-green-400/20 text-green-400 text-xs px-2 py-1 rounded-full">
                          -{producto.descuento}% descuento
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {producto.descuento > 0 && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-600 line-through">
                        ${Number(producto.precio).toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl font-black text-green-400">
                      ${precioFinal.toLocaleString()}
                    </span>
                    <BotonCarrito producto={{ ...producto, precio: precioFinal }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}