"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Search, X, SlidersHorizontal, Package, Keyboard, Mouse, Headphones, Mic, Sparkles, TrendingUp } from "lucide-react";
import { useCompraRapida } from "../store/compraRapidaStore";
import { getProductUrl } from "../lib/slugs";
import ProductsPagination from "./productos/ProductsPagination";
import { ProductGridSkeleton } from "./productos/ProductCardSkeleton";

const BotonCarrito = dynamic(() => import("./BotonCarrito"), { ssr: false });

function precioFinal(producto) {
  return producto.descuento > 0
    ? producto.precio - (producto.precio * producto.descuento) / 100
    : producto.precio;
}

// Iconos por categoría
function CategoryIcon({ categoria }) {
  const iconClass = "w-4 h-4";
  switch (categoria) {
    case "Teclados":
      return <Keyboard className={iconClass} />;
    case "Mouse":
      return <Mouse className={iconClass} />;
    case "Audífonos":
      return <Headphones className={iconClass} />;
    case "Micrófonos":
      return <Mic className={iconClass} />;
    default:
      return <Package className={iconClass} />;
  }
}

function ProductoCard({ producto }) {
  const pf = precioFinal(producto);

  return (
    <Link href={getProductUrl(producto)} className="group block">
      <article
        className={`relative flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg ${
          producto.stock === 0 ? "opacity-60" : ""
        }`}
      >
        {/* Badge de descuento */}
        {producto.stock > 0 && producto.descuento > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-zinc-900 dark:bg-white px-2.5 py-1 text-[10px] font-bold text-white dark:text-black">
            -{producto.descuento}%
          </span>
        )}

        {/* Imagen */}
        <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-800/50">
          {producto.stock === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <span className="rounded-full bg-white/90 dark:bg-zinc-900/90 px-4 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Agotado
              </span>
            </div>
          )}
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col p-4">
          {/* Categoría */}
          {producto.categoria && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              <CategoryIcon categoria={producto.categoria} />
              {producto.categoria}
            </span>
          )}

          {/* Nombre */}
          <h2 className="flex-1 text-sm font-semibold text-zinc-900 dark:text-white line-clamp-2 mb-3 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            {producto.nombre}
          </h2>

          {/* Precio */}
          <div className="mb-4">
            {producto.descuento > 0 && (
              <p className="text-xs text-zinc-400 line-through mb-0.5">
                ${Number(producto.precio).toLocaleString('es-CO')}
              </p>
            )}
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              ${pf.toLocaleString('es-CO')}
            </p>
          </div>

          {/* Botón */}
          {producto.stock === 0 ? (
            <button
              disabled
              className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 py-2.5 text-sm font-medium text-zinc-400 cursor-not-allowed"
            >
              No disponible
            </button>
          ) : (
            <div onClick={(e) => e.preventDefault()}>
              <BotonCarrito producto={{ ...producto, precio: pf }} />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function ProductosListado({ productos: initialProductos, searchParams }) {
  const [productos, setProductos] = useState(initialProductos || []);
  const [busqueda, setBusqueda] = useState(searchParams?.q || "");
  const [categoriaActiva, setCategoriaActiva] = useState(searchParams?.categoria || "Todos");
  const [orden, setOrden] = useState("default");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  useEffect(() => {
    setCargando(true);
    const timer = setTimeout(() => {
      setProductos(initialProductos || []);
      setCargando(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [initialProductos]);

  const categorias = useMemo(
    () => ["Todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))],
    [productos],
  );

  const productosFiltrados = useMemo(() => {
    return productos
      .filter((producto) => {
        const texto = busqueda.toLowerCase();
        const coincideBusqueda =
          producto.nombre.toLowerCase().includes(texto) ||
          producto.descripcion?.toLowerCase().includes(texto);

        const coincideCategoria =
          categoriaActiva === "Todos" || producto.categoria === categoriaActiva;

        // Filtro de ofertas
        const esOferta = searchParams?.oferta === "true";
        const coincideOferta = !esOferta || (producto.descuento > 0);

        return coincideBusqueda && coincideCategoria && coincideOferta;
      })
      .sort((a, b) => {
        if (orden === "precio-asc") return precioFinal(a) - precioFinal(b);
        if (orden === "precio-desc") return precioFinal(b) - precioFinal(a);
        if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
        if (orden === "descuento") return b.descuento - a.descuento;
        return 0;
      });
  }, [productos, busqueda, categoriaActiva, orden, searchParams?.oferta]);

  const itemsPorPagina = 12;
  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / itemsPorPagina));

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaActiva, orden]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const inicio = (paginaActual - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(inicio, inicio + itemsPorPagina);

  // Contadores
  const productosEnOferta = productos.filter(p => p.descuento > 0).length;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">
      {/* Header */}
      <header className="pt-28 pb-8 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Título */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {searchParams?.oferta === "true" ? (
                  <>
                    <span className="text-red-500">Ofertas</span> especiales
                  </>
                ) : (
                  "Productos"
                )}
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
                {busqueda && ` para "${busqueda}"`}
              </p>
            </div>

            {/* Quick stats */}
            {productosEnOferta > 0 && (
              <Link
                href="/productos?oferta=true"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
              >
                <TrendingUp size={16} />
                {productosEnOferta} en oferta
              </Link>
            )}
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 pl-11 pr-10 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Ordenar */}
            <div className="flex gap-2">
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 cursor-pointer"
              >
                <option value="default">Más recientes</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="nombre">Nombre A-Z</option>
                <option value="descuento">Mayor descuento</option>
              </select>

              {/* Filtros móvil */}
              <button
                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                className="sm:hidden flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros de categoría */}
      <div className="sticky top-16 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaActiva(categoria)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  categoriaActiva === categoria
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {categoria !== "Todos" && <CategoryIcon categoria={categoria} />}
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        {cargando ? (
          <ProductGridSkeleton count={12} />
        ) : productosFiltrados.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6">
              <Search size={24} className="text-zinc-400" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              No hay resultados
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
              No encontramos productos que coincidan con tu búsqueda. Intenta con otros términos.
            </p>
            <button
              onClick={() => {
                setBusqueda("");
                setCategoriaActiva("Todos");
                setOrden("default");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          </div>
        ) : (
          /* Grid de productos */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {productosPaginados.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <ProductsPagination
                currentPage={paginaActual}
                totalPages={totalPaginas}
                onPageChange={setPaginaActual}
              />
            )}
          </>
        )}
      </main>

      {/* Footer espaciador */}
      <div className="h-16" />
    </div>
  );
}
