"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useCarrito } from "../store/carritoStore"
import { useProductos } from "../store/productosStore"
import { useWishlist } from "../store/wishlistStore"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, Package, Keyboard, Mouse, Headphones, Mic, Sun, Moon, ArrowRight, User } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { getProductUrl } from "../lib/slugs"

export default function Navbar() {
  const items = useCarrito((state) => state.items)
  const productos = useProductos((state) => state.productos)
  const { items: wishlist, toggleWishlist } = useWishlist()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false)
  const [wishlistAbierta, setWishlistAbierta] = useState(false)
  const [query, setQuery] = useState("")
  const busquedaRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = mounted ? items.reduce((acc, item) => acc + item.cantidad, 0) : 0
  const wishlistCount = mounted ? wishlist.length : 0

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (busquedaAbierta && busquedaRef.current) {
      busquedaRef.current.focus()
    }
  }, [busquedaAbierta])

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
      {/* ═══════════════════════════════════════════════════════════════════════
          NAVBAR MINIMALISTA - TODO CENTRADO
      ═══════════════════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[calc(100%-2rem)] max-w-4xl ${
        scrolled 
          ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 border-zinc-300 dark:border-zinc-700" 
          : "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-zinc-200/50 dark:border-zinc-700/50"
      } rounded-2xl border`}>
        
        <div className="px-4 md:px-6">
          {/* Todo centrado en una fila */}
          <div className="flex items-center justify-center h-12 md:h-14 gap-1 md:gap-2">
            
            {/* Menú móvil */}
            <button
              onClick={() => { setMenuAbierto(!menuAbierto); cerrarTodo() }}
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuAbierto}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              {menuAbierto ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Navegación principal (Desktop) */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Inicio
              </Link>
              
              <div className="relative">
                <button
                  onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
                  aria-expanded={categoriasAbiertas}
                  aria-haspopup="menu"
                  className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1"
                >
                  Categorías
                  <ChevronDown size={12} className={`transition-transform duration-200 ${categoriasAbiertas ? "rotate-180" : ""}`} />
                </button>
                
                {categoriasAbiertas && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden min-w-44 z-50" role="menu">
                    <div className="p-2">
                      {categorias.map((cat) => (
                        <Link
                          key={cat}
                          href={cat === "Todos" ? "/productos" : `/productos?categoria=${cat}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-zinc-600 dark:text-zinc-400 hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all text-sm"
                          onClick={() => setCategoriasAbiertas(false)}
                          role="menuitem"
                        >
                          <span className="text-green-500" aria-hidden="true">
                            {cat === "Teclados" ? <Keyboard size={16} /> :
                             cat === "Mouse" ? <Mouse size={16} /> :
                             cat === "Audífonos" ? <Headphones size={16} /> :
                             cat === "Micrófonos" ? <Mic size={16} /> :
                             <Package size={16} />}
                          </span>
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/productos" className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Productos
              </Link>

              <Link href="/productos?oferta=true" className="px-3 py-1.5 text-sm font-semibold text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all">
                Ofertas
              </Link>
            </div>

            {/* Separador visual (Desktop) */}
            <div className="hidden md:block w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-2" />

            {/* Acciones */}
            <div className="flex items-center gap-0.5">
              {/* Búsqueda */}
              <button
                onClick={() => { setBusquedaAbierta(!busquedaAbierta); setWishlistAbierta(false); setQuery("") }}
                aria-label="Buscar productos"
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <Search size={17} />
              </button>

              {/* Toggle tema */}
              <button
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Usuario - solo desktop */}
              <Link
                href="/login"
                aria-label="Iniciar sesión"
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <User size={17} />
              </Link>

              {/* Wishlist - solo desktop */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => { setWishlistAbierta(!wishlistAbierta); setBusquedaAbierta(false) }}
                  aria-label={`Favoritos${wishlistCount > 0 ? `, ${wishlistCount} productos` : ''}`}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all relative"
                >
                  <Heart size={17} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                
                {/* Wishlist dropdown */}
                {wishlistAbierta && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 flex justify-between items-center">
                      <h3 className="text-zinc-800 dark:text-white font-semibold text-sm">Favoritos</h3>
                      <button onClick={() => setWishlistAbierta(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition">
                        <X size={14} />
                      </button>
                    </div>
                    {wishlist.length === 0 ? (
                      <div className="px-4 py-8 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                        No tienes favoritos aún
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        {wishlist.map((p) => (
                          <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition">
                            <Link href={getProductUrl(p)} onClick={() => setWishlistAbierta(false)} className="flex items-center gap-3 flex-1 min-w-0">
                              <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-zinc-800 dark:text-white text-sm truncate">{p.nombre}</p>
                                <p className="text-green-500 text-sm font-semibold">${precioFinal(p).toLocaleString()}</p>
                              </div>
                            </Link>
                            <button onClick={() => toggleWishlist(p)} className="text-zinc-400 hover:text-red-500 transition flex-shrink-0">
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
                aria-label={`Carrito${totalItems > 0 ? `, ${totalItems} productos` : ''}`}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all relative"
              >
                <ShoppingCart size={17} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Buscador expandido */}
          {busquedaAbierta && (
            <div className="border-t border-black/5 dark:border-white/10 py-3">
              <div className="relative max-w-md mx-auto">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
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
                  placeholder="¿Qué buscas?"
                  className="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-4 py-2.5 pl-10 pr-10 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Resultados */}
              {resultados.length > 0 && (
                <div className="max-w-md mx-auto mt-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/10">
                  {resultados.map((p) => (
                    <Link
                      key={p.id}
                      href={getProductUrl(p)}
                      onClick={() => { setBusquedaAbierta(false); setQuery("") }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition border-b border-black/5 dark:border-white/10 last:border-0"
                    >
                      <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-zinc-800 dark:text-white text-sm font-medium truncate">{p.nombre}</p>
                        <p className="text-green-500 text-sm font-semibold">${precioFinal(p).toLocaleString()}</p>
                      </div>
                      <ArrowRight size={14} className="text-zinc-400 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}

              {query.length > 1 && resultados.length === 0 && (
                <div className="max-w-md mx-auto mt-3 text-center text-zinc-500 text-sm py-4">
                  No encontramos "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          MENÚ MÓVIL - iOS Style
      ═══════════════════════════════════════════════════════════════════════ */}
      {menuAbierto && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-black md:hidden flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header del menú */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">Menú</span>
            <button
              onClick={() => setMenuAbierto(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-4">
              {/* Navegación principal */}
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center justify-between py-3 px-4 rounded-xl text-zinc-900 dark:text-white font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <span>Inicio</span>
                  <ArrowRight size={14} className="text-zinc-400" />
                </Link>

                <Link
                  href="/productos"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center justify-between py-3 px-4 rounded-xl text-zinc-900 dark:text-white font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <span>Productos</span>
                  <ArrowRight size={14} className="text-zinc-400" />
                </Link>

                <Link
                  href="/productos?oferta=true"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center justify-between py-3 px-4 rounded-xl text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Ofertas
                  </span>
                  <ArrowRight size={14} className="text-red-400" />
                </Link>
              </div>

              {/* Categorías */}
              <div className="mt-6">
                <p className="text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2 px-4">
                  Categorías
                </p>
                <div className="space-y-0.5">
                  {categorias.filter(c => c !== "Todos").map((cat) => (
                    <Link
                      key={cat}
                      href={`/productos?categoria=${cat}`}
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-zinc-700 dark:text-zinc-300 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        {cat === "Teclados" ? <Keyboard size={16} /> :
                         cat === "Mouse" ? <Mouse size={16} /> :
                         cat === "Audífonos" ? <Headphones size={16} /> :
                         cat === "Micrófonos" ? <Mic size={16} /> :
                         <Package size={16} />}
                      </span>
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Cuenta */}
              <div className="mt-6">
                <p className="text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2 px-4">
                  Cuenta
                </p>
                <div className="space-y-0.5">
                  <Link
                    href="/login"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-zinc-700 dark:text-zinc-300 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      <User size={16} />
                    </span>
                    Iniciar sesión
                  </Link>

                  <Link
                    href="/favoritos"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center justify-between py-3 px-4 rounded-xl text-zinc-700 dark:text-zinc-300 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        <Heart size={16} />
                      </span>
                      Favoritos
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/carrito"
                    onClick={() => setMenuAbierto(false)}
                    className="flex items-center justify-between py-3 px-4 rounded-xl text-zinc-700 dark:text-zinc-300 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        <ShoppingCart size={16} />
                      </span>
                      Carrito
                    </div>
                    {totalItems > 0 && (
                      <span className="bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del menú */}
          <div className="p-5 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/productos"
              onClick={() => setMenuAbierto(false)}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Ver todos los productos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdowns */}
      {(wishlistAbierta || categoriasAbiertas) && (
        <div
          className="fixed inset-0 z-30"
          onClick={cerrarTodo}
        />
      )}
    </>
  )
}
