"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useCarrito } from "../store/carritoStore"
import { useProductos } from "../store/productosStore"
import { useWishlist } from "../store/wishlistStore"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown, Package, Keyboard, Mouse, Headphones, Mic, Sun, Moon, ArrowRight, Phone, Truck, CreditCard, User } from "lucide-react"
import { useTheme } from "./ThemeProvider"

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

  // Evitar mismatch de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = mounted ? items.reduce((acc, item) => acc + item.cantidad, 0) : 0
  const wishlistCount = mounted ? wishlist.length : 0

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
      {/* ═══════════════════════════════════════════════════════════════════════
          ESTILO TROJAN - BARRA SUPERIOR DE UTILIDADES
      ═══════════════════════════════════════════════════════════════════════ */}
      
      {/* Móvil: Mini utility bar */}
      <div className="md:hidden bg-zinc-900 text-white text-[10px] font-medium tracking-wide">
        <div className="flex items-center justify-center gap-2 py-1.5 px-3">
          <Truck size={10} className="text-green-400 flex-shrink-0" />
          <span className="text-green-400">ENVÍO GRATIS +$99K</span>
          <span className="mx-1">•</span>
          <span>PAGA DESPUÉS</span>
        </div>
      </div>

      {/* Desktop: Utility bar completa */}
      <div className="hidden md:block bg-zinc-900 text-white text-[11px] font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-1.5 hover:text-green-400 transition">
              <CreditCard size={12} />
              <span>COMPRA AHORA, PAGA DESPUÉS</span>
            </a>
            <a href="tel:+573001112233" className="flex items-center gap-1.5 hover:text-green-400 transition">
              <Phone size={12} />
              <span>¿NECESITAS AYUDA? LLÁMANOS</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-green-400">
            <Truck size={12} />
            <span>ENVÍO GRATIS EN PEDIDOS +$99.000</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          ESTILO TROJAN - HEADER PRINCIPAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <nav className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-zinc-950 shadow-lg"
          : "bg-white dark:bg-zinc-950"
      }`}>
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          {/* Header principal */}
          <div className="flex items-center justify-between py-2.5 md:py-4 border-b border-zinc-200 dark:border-zinc-800">
            
            {/* Izquierda: Búsqueda */}
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => { setBusquedaAbierta(!busquedaAbierta); setWishlistAbierta(false); setQuery("") }}
                aria-label="Buscar productos"
                className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition text-sm"
              >
                <Search size={18} />
                <span className="hidden md:inline">Buscar</span>
              </button>
            </div>

            {/* Centro: Logo */}
            <Link href="/" className="flex-shrink-0" onClick={cerrarTodo}>
              <span className="text-xl md:text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
                COAM<span className="text-green-400">TEC</span>
              </span>
            </Link>

            {/* Derecha: Acciones */}
            <div className="flex items-center justify-end gap-0.5 md:gap-2 flex-1">
              {/* Toggle tema */}
              <button
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Usuario - solo desktop */}
              <Link
                href="/login"
                aria-label="Iniciar sesión o ver perfil"
                className="hidden md:flex w-11 h-11 items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <User size={20} />
              </Link>

              {/* Wishlist - solo desktop */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => { setWishlistAbierta(!wishlistAbierta); setBusquedaAbierta(false) }}
                  aria-label={`Ver favoritos${wishlistCount > 0 ? `, ${wishlistCount} productos` : ''}`}
                  className="flex w-11 h-11 items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition relative"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-400 text-black text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Carrito */}
              <Link
                href="/carrito"
                aria-label={`Ver carrito${totalItems > 0 ? `, ${totalItems} productos` : ''}`}
                className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-green-400 text-black text-[9px] md:text-[10px] font-black rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburguesa móvil */}
              <button
                onClick={() => { setMenuAbierto(!menuAbierto); cerrarTodo() }}
                aria-label={menuAbierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                aria-expanded={menuAbierto}
                className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              >
                {menuAbierto ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Menú de navegación - estilo Trojan */}
          <div className="hidden md:flex items-center justify-center gap-1 py-3">
            <Link href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-green-500 dark:hover:text-green-400 px-4 py-2 text-sm font-medium uppercase tracking-wide transition">
              Inicio
            </Link>
            
            <div className="relative group">
              <button
                onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
                aria-expanded={categoriasAbiertas}
                aria-haspopup="menu"
                className="text-zinc-700 dark:text-zinc-300 hover:text-green-500 dark:hover:text-green-400 px-4 py-2 text-sm font-medium uppercase tracking-wide transition flex items-center gap-1"
              >
                Categorías
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoriasAbiertas ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {categoriasAbiertas && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xl min-w-52 z-50" role="menu">
                  {categorias.map((cat) => (
                    <Link
                      key={cat}
                      href={cat === "Todos" ? "/productos" : `/productos?categoria=${cat}`}
                      className="flex items-center gap-3 px-5 py-3 text-zinc-600 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition text-sm"
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
              )}
            </div>

            <Link href="/productos" className="text-zinc-700 dark:text-zinc-300 hover:text-green-500 dark:hover:text-green-400 px-4 py-2 text-sm font-medium uppercase tracking-wide transition">
              Productos
            </Link>

            <Link href="/productos?oferta=true" className="text-red-500 hover:text-red-400 px-4 py-2 text-sm font-bold uppercase tracking-wide transition">
              Ofertas
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            MARQUEE PROMOCIONAL - ESTILO TROJAN
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="bg-green-500 text-black overflow-hidden">
          <div className="flex whitespace-nowrap py-1.5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-wide md:tracking-wider [animation:marquee_20s_linear_infinite]">
            <span className="mx-4 md:mx-8">🔥 SALE</span>
            <span className="mx-2 md:mx-8">•</span>
            <span className="mx-4 md:mx-8">ENVÍO GRATIS +$99K</span>
            <span className="mx-2 md:mx-8">•</span>
            <span className="mx-4 md:mx-8">NUEVOS</span>
            <span className="mx-2 md:mx-8">•</span>
            <span className="mx-4 md:mx-8">🔥 SALE</span>
            <span className="mx-2 md:mx-8">•</span>
            <span className="mx-4 md:mx-8">ENVÍO GRATIS +$99K</span>
            <span className="mx-2 md:mx-8">•</span>
            <span className="mx-4 md:mx-8">NUEVOS</span>
            <span className="mx-2 md:mx-8">•</span>
            <span className="mx-4 md:mx-8">🔥 SALE</span>
            <span className="mx-2 md:mx-8">•</span>
            <span className="mx-4 md:mx-8">ENVÍO GRATIS +$99K</span>
            <span className="mx-2 md:mx-8">•</span>
            <span className="mx-4 md:mx-8">NUEVOS</span>
            <span className="mx-2 md:mx-8">•</span>
          </div>
        </div>

        {/* Buscador expandido */}
        {busquedaAbierta && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 md:px-4 py-3 md:py-4">
            <div className="relative max-w-2xl mx-auto">
              <Search size={16} className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
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
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-full px-4 py-2.5 md:py-3 pl-10 md:pl-12 pr-10 md:pr-12 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 md:right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Resultados */}
            {resultados.length > 0 && (
              <div className="max-w-2xl mx-auto mt-2 md:mt-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                {resultados.map((p) => (
                  <Link
                    key={p.id}
                    href={`/productos/${p.id}`}
                    onClick={() => { setBusquedaAbierta(false); setQuery("") }}
                    className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <img src={p.imagen} alt={p.nombre} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-zinc-800 dark:text-white text-xs md:text-sm font-medium truncate">{p.nombre}</p>
                      <p className="text-green-500 text-xs md:text-sm font-bold">${precioFinal(p).toLocaleString()}</p>
                    </div>
                    <ArrowRight size={14} className="text-zinc-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            {query.length > 1 && resultados.length === 0 && (
              <div className="max-w-2xl mx-auto mt-2 md:mt-3 text-center text-zinc-500 text-xs md:text-sm py-4 md:py-6">
                No encontramos "{query}"
              </div>
            )}
          </div>
        )}

        {/* Wishlist dropdown */}
        {wishlistAbierta && (
          <div className="absolute right-4 top-full mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-zinc-800 dark:text-white font-bold text-sm">Mis Favoritos</h3>
              <button onClick={() => setWishlistAbierta(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition">
                <X size={14} />
              </button>
            </div>
            {wishlist.length === 0 ? (
              <div className="px-4 py-10 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                No tienes favoritos aún
              </div>
            ) : (
              wishlist.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                  <Link href={`/productos/${p.id}`} onClick={() => setWishlistAbierta(false)} className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={p.imagen} alt={p.nombre} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-zinc-800 dark:text-white text-sm truncate">{p.nombre}</p>
                      <p className="text-green-500 text-sm font-bold">${precioFinal(p).toLocaleString()}</p>
                    </div>
                  </Link>
                  <button onClick={() => toggleWishlist(p)} className="text-zinc-400 hover:text-red-500 transition flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          MENÚ MÓVIL FULLSCREEN
      ═══════════════════════════════════════════════════════════════════════ */}
      {menuAbierto && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-zinc-950 pt-24 flex flex-col md:hidden">
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-0">

            <Link
              href="/"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-between py-3.5 border-b border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-white font-semibold uppercase tracking-wide text-sm"
            >
              Inicio <ArrowRight size={14} className="text-zinc-400" />
            </Link>

            <Link
              href="/productos"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-between py-3.5 border-b border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-white font-semibold uppercase tracking-wide text-sm"
            >
              Productos <ArrowRight size={14} className="text-zinc-400" />
            </Link>

            <Link
              href="/productos?oferta=true"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-between py-3.5 border-b border-zinc-100 dark:border-zinc-800 text-red-500 font-bold uppercase tracking-wide text-sm"
            >
              🔥 Ofertas <ArrowRight size={14} className="text-red-400" />
            </Link>

            <p className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mt-5 mb-1.5">Categorías</p>

            {categorias.filter(c => c !== "Todos").map((cat) => (
              <Link
                key={cat}
                href={`/productos?categoria=${cat}`}
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm"
              >
                <span className="text-green-500">
                  {cat === "Teclados" ? <Keyboard size={16} /> :
                   cat === "Mouse" ? <Mouse size={16} /> :
                   cat === "Audífonos" ? <Headphones size={16} /> :
                   cat === "Micrófonos" ? <Mic size={16} /> :
                   <Package size={16} />}
                </span>
                {cat}
              </Link>
            ))}

            <p className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mt-5 mb-1.5">Mi Cuenta</p>

            <Link
              href="/login"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm"
            >
              <User size={16} className="text-green-500" />
              Iniciar sesión
            </Link>

            <Link
              href="/carrito"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={16} className="text-green-500" />
                Carrito
              </div>
              {totalItems > 0 && (
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => { setMenuAbierto(false); setWishlistAbierta(true) }}
              className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 w-full text-left text-sm"
            >
              <div className="flex items-center gap-3">
                <Heart size={16} className="text-green-500" />
                Favoritos
              </div>
              {wishlistCount > 0 && (
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Footer menú móvil */}
          <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
            <Link
              href="/productos"
              onClick={() => setMenuAbierto(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 text-sm uppercase tracking-wide transition"
            >
              Ver productos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdowns */}
      {(wishlistAbierta || categoriasAbiertas) && (
        <div
          className="fixed inset-0 z-40"
          onClick={cerrarTodo}
        />
      )}
    </>
  )
}