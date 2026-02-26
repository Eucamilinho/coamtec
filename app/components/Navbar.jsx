"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useCarrito } from "../store/carritoStore"
import { useProductos } from "../store/productosStore"
import { useWishlist } from "../store/wishlistStore"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, Package, Keyboard, Mouse, Headphones, Mic, Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export default function Navbar() {
  const items = useCarrito((state) => state.items)
  const productos = useProductos((state) => state.productos)
  const { items: wishlist, toggleWishlist } = useWishlist()
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const [scrolled, setScrolled] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false)
  const [wishlistAbierta, setWishlistAbierta] = useState(false)
  const [query, setQuery] = useState("")
  const busquedaRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (busquedaAbierta && busquedaRef.current) {
      busquedaRef.current.focus()
    }
  }, [busquedaAbierta])

  const categorias = ["Todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))]

  const precioFinal = (p) => {
    if (!p || !p.precio) return 0
    const precio = Number(p.precio)
    const descuento = Number(p.descuento) || 0
    return descuento > 0 ? precio - (precio * descuento) / 100 : precio
  }

  const resultados = query.length > 1
    ? productos.filter((p) =>
        p.nombre.toLowerCase().includes(query.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-xl"
          : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="text-xl font-black tracking-tighter flex-shrink-0 text-zinc-900 dark:text-white">
            COAM<span className="text-green-400">TEC</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm"
            >
              Inicio
            </Link>

            {/* Categorías dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
                onBlur={() => setTimeout(() => setCategoriasAbiertas(false), 150)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm flex items-center gap-1"
              >
                Categorías
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${categoriasAbiertas ? "rotate-180" : ""}`}
                />
              </button>
              {categoriasAbiertas && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xl min-w-48">
                  {categorias.map((cat) => (
                    <Link
                      key={cat}
                      href={cat === "Todos" ? "/productos" : `/productos?categoria=${cat}`}
                      className="flex items-center gap-2 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:text-green-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm"
                      onClick={() => setCategoriasAbiertas(false)}
                    >
                      {cat === "Teclados" ? <Keyboard size={14} /> :
                       cat === "Mouse" ? <Mouse size={14} /> :
                       cat === "Audífonos" ? <Headphones size={14} /> :
                       cat === "Micrófonos" ? <Mic size={14} /> :
                       <Package size={14} />}
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/productos"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm"
            >
              Productos
            </Link>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">

            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Buscador */}
            <div className="relative">
              <button
                onClick={() => { setBusquedaAbierta(!busquedaAbierta); setQuery("") }}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <Search size={18} />
              </button>
              {busquedaAbierta && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-3">
                    <input
                      ref={busquedaRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && query) {
                          router.push(`/productos?q=${query}`)
                          setBusquedaAbierta(false)
                          setQuery("")
                        }
                        if (e.key === "Escape") setBusquedaAbierta(false)
                      }}
                      placeholder="Buscar productos..."
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-green-400"
                    />
                  </div>
                  {resultados.length > 0 && (
                    <div className="border-t border-zinc-200 dark:border-zinc-800">
                      {resultados.map((p) => (
                        <Link
                          key={p.id}
                          href={`/productos/${p.id}`}
                          onClick={() => { setBusquedaAbierta(false); setQuery("") }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                          <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-zinc-800 dark:text-white text-sm font-medium truncate">{p.nombre}</p>
                            <p className="text-green-400 text-xs font-bold">${precioFinal(p).toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {query.length > 1 && resultados.length === 0 && (
                    <div className="px-4 py-6 text-center text-zinc-400 dark:text-zinc-500 text-sm border-t border-zinc-200 dark:border-zinc-800">
                      No encontramos "{query}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div className="relative">
              <button
                onClick={() => setWishlistAbierta(!wishlistAbierta)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition relative"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-400 text-black text-xs font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              {wishlistAbierta && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-zinc-800 dark:text-white font-bold text-sm">Favoritos</h3>
                    <button onClick={() => setWishlistAbierta(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition text-xs">
                      <X size={14} />
                    </button>
                  </div>
                  {wishlist.length === 0 ? (
                    <div className="px-4 py-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                      No tienes favoritos aún
                    </div>
                  ) : (
                    <div>
                      {wishlist.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition group">
                          <Link href={`/productos/${p.id}`} onClick={() => setWishlistAbierta(false)} className="flex items-center gap-3 flex-1 min-w-0">
                            <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-zinc-800 dark:text-white text-sm truncate">{p.nombre}</p>
                              <p className="text-green-400 text-xs font-bold">${precioFinal(p).toLocaleString()}</p>
                            </div>
                          </Link>
                          <button
                            onClick={() => toggleWishlist(p)}
                            className="text-zinc-400 hover:text-red-400 transition flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Carrito */}
            <Link
              href="/carrito"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-400 text-black text-xs font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Menú hamburguesa móvil */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {menuAbierto ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuAbierto && (
          <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex flex-col gap-2">
            <Link href="/" onClick={() => setMenuAbierto(false)} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-3 border-b border-zinc-200 dark:border-zinc-800 transition">
              Inicio
            </Link>
            <Link href="/productos" onClick={() => setMenuAbierto(false)} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-3 border-b border-zinc-200 dark:border-zinc-800 transition">
              Productos
            </Link>
            {categorias.filter(c => c !== "Todos").map((cat) => (
              <Link
                key={cat}
                href={`/productos?categoria=${cat}`}
                onClick={() => setMenuAbierto(false)}
                className="text-zinc-500 dark:text-zinc-500 hover:text-green-400 py-2 pl-4 transition text-sm"
              >
                {cat}
              </Link>
            ))}
            <Link href="/carrito" onClick={() => setMenuAbierto(false)} className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-3 transition">
              Carrito {totalItems > 0 && <span className="bg-green-400 text-black text-xs font-black px-2 py-0.5 rounded-full ml-2">{totalItems}</span>}
            </Link>
          </div>
        )}
      </nav>

      {/* Overlay */}
      {(busquedaAbierta || wishlistAbierta || categoriasAbiertas) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setBusquedaAbierta(false)
            setWishlistAbierta(false)
            setCategoriasAbiertas(false)
          }}
        />
      )}
    </>
  )
}