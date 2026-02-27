"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useCarrito } from "../store/carritoStore"
import { useProductos } from "../store/productosStore"
import { useWishlist } from "../store/wishlistStore"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, Package, Keyboard, Mouse, Headphones, Mic, Sun, Moon, ArrowRight } from "lucide-react"
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

  // Bloquear scroll cuando menú móvil está abierto
  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuAbierto])

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

  const cerrarTodo = () => {
    setBusquedaAbierta(false)
    setWishlistAbierta(false)
    setCategoriasAbiertas(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-xl"
          : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2" onClick={cerrarTodo}>
            <img
              src="/logo.svg"
              alt="Coam Tec"
              className="h-8 w-auto hover:scale-110 transition-transform duration-300"
            />
            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">
              COAM<span className="text-green-400">TEC</span>
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm">
              Inicio
            </Link>
            <div className="relative">
              <button
                onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
                onBlur={() => setTimeout(() => setCategoriasAbiertas(false), 150)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm flex items-center gap-1"
              >
                Categorías
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoriasAbiertas ? "rotate-180" : ""}`} />
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
            <Link href="/productos" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm">
              Productos
            </Link>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1">

            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Buscador - solo icono en móvil */}
            <button
              onClick={() => { setBusquedaAbierta(!busquedaAbierta); setWishlistAbierta(false); setQuery("") }}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Search size={18} />
            </button>

            {/* Wishlist - oculto en móvil */}
            <button
              onClick={() => { setWishlistAbierta(!wishlistAbierta); setBusquedaAbierta(false) }}
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition relative"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-400 text-black text-xs font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

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

            {/* Hamburguesa */}
            <button
              onClick={() => { setMenuAbierto(!menuAbierto); cerrarTodo() }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              {menuAbierto ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Buscador expandido - full width en móvil */}
        {busquedaAbierta && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3">
            <div className="relative max-w-7xl mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
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
                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 pl-10 pr-10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-green-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Resultados */}
            {resultados.length > 0 && (
              <div className="max-w-7xl mx-auto mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                {resultados.map((p) => (
                  <Link
                    key={p.id}
                    href={`/productos/${p.id}`}
                    onClick={() => { setBusquedaAbierta(false); setQuery("") }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-zinc-800 dark:text-white text-sm font-medium truncate">{p.nombre}</p>
                      <p className="text-green-400 text-xs font-bold">${precioFinal(p).toLocaleString()}</p>
                    </div>
                    <ArrowRight size={14} className="text-zinc-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            {query.length > 1 && resultados.length === 0 && (
              <div className="max-w-7xl mx-auto mt-2 text-center text-zinc-400 text-sm py-4">
                No encontramos "{query}"
              </div>
            )}
          </div>
        )}

        {/* Wishlist dropdown desktop */}
        {wishlistAbierta && (
          <div className="hidden md:block absolute right-6 top-full mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-zinc-800 dark:text-white font-bold text-sm">Favoritos</h3>
              <button onClick={() => setWishlistAbierta(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition">
                <X size={14} />
              </button>
            </div>
            {wishlist.length === 0 ? (
              <div className="px-4 py-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                No tienes favoritos aún
              </div>
            ) : (
              wishlist.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                  <Link href={`/productos/${p.id}`} onClick={() => setWishlistAbierta(false)} className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-zinc-800 dark:text-white text-sm truncate">{p.nombre}</p>
                      <p className="text-green-400 text-xs font-bold">${precioFinal(p).toLocaleString()}</p>
                    </div>
                  </Link>
                  <button onClick={() => toggleWishlist(p)} className="text-zinc-400 hover:text-red-400 transition flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </nav>

      {/* Menú móvil fullscreen */}
      {menuAbierto && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-zinc-950 pt-20 flex flex-col md:hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-2">

            <Link
              href="/"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
            >
              Inicio <ArrowRight size={16} className="text-zinc-400" />
            </Link>

            <Link
              href="/productos"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
            >
              Todos los productos <ArrowRight size={16} className="text-zinc-400" />
            </Link>

            <p className="text-zinc-400 text-xs font-mono tracking-widest uppercase mt-4 mb-2">Categorías</p>

            {categorias.filter(c => c !== "Todos").map((cat) => (
              <Link
                key={cat}
                href={`/productos?categoria=${cat}`}
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                <span className="text-green-400">
                  {cat === "Teclados" ? <Keyboard size={16} /> :
                   cat === "Mouse" ? <Mouse size={16} /> :
                   cat === "Audífonos" ? <Headphones size={16} /> :
                   cat === "Micrófonos" ? <Mic size={16} /> :
                   <Package size={16} />}
                </span>
                {cat}
              </Link>
            ))}

            <p className="text-zinc-400 text-xs font-mono tracking-widest uppercase mt-4 mb-2">Mi cuenta</p>

            <Link
              href="/carrito"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-green-400" />
                Carrito
              </div>
              {totalItems > 0 && (
                <span className="bg-green-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/carrito"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-2 py-4 border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
            >
              <Heart size={18} className="text-green-400" />
              Favoritos
              {wishlist.length > 0 && (
                <span className="bg-green-400 text-black text-xs font-black px-2 py-0.5 rounded-full ml-auto">
                  {wishlist.length}
                </span>
              )}
            </Link>

          </div>

          {/* Footer menú */}
          <div className="px-6 py-6 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/productos"
              onClick={() => setMenuAbierto(false)}
              className="w-full bg-green-400 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 text-lg"
            >
              Ver productos
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      )}

      {/* Overlay */}
      {(wishlistAbierta) && (
        <div
          className="fixed inset-0 z-40"
          onClick={cerrarTodo}
        />
      )}
    </>
  )
}