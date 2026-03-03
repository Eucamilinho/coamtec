"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Grid, List, Search, X, Zap } from "lucide-react";
import { useCompraRapida } from "../store/compraRapidaStore";
import ProductsPagination from "./productos/ProductsPagination";
import {
  ProductGridSkeleton,
  ProductListSkeleton,
} from "./productos/ProductCardSkeleton";

const BotonCarrito = dynamic(() => import("./BotonCarrito"), { ssr: false });

function precioFinal(producto) {
  return producto.descuento > 0
    ? producto.precio - (producto.precio * producto.descuento) / 100
    : producto.precio;
}

function ProductoCardGrid({ producto }) {
  const pf = precioFinal(producto);

  return (
    <Link href={`/productos/${producto.id}`} className="group">
      <article
        className={`relative flex h-full flex-col rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white dark:hover:bg-zinc-800 ${
          producto.stock === 0 ? "opacity-70" : ""
        }`}
      >
        {producto.stock > 0 && producto.descuento > 0 && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-green-500 px-2 py-1 text-[11px] font-black text-white">
            -{producto.descuento}%
          </span>
        )}

        <div className="relative overflow-hidden rounded-xl shimmer-bg">
          {producto.stock === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-200">
                Sin stock
              </span>
            </div>
          )}
          <Image
            src={producto.imagen}
            alt={`${producto.nombre} - ${producto.categoria || "Producto"}`}
            width={420}
            height={320}
            loading="lazy"
            unoptimized
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="mt-4 flex-1 space-y-2">
          {producto.categoria && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {producto.categoria}
            </p>
          )}
          <h2 className="line-clamp-2 min-h-[48px] text-base font-semibold text-zinc-900 dark:text-white transition group-hover:text-green-600 dark:group-hover:text-green-400">
            {producto.nombre}
          </h2>
        </div>

        <div className="mt-3">
          {producto.descuento > 0 && (
            <p className="text-xs text-zinc-500 line-through">
              ${Number(producto.precio).toLocaleString()}
            </p>
          )}
          <p className="text-2xl font-extrabold text-zinc-900 dark:text-green-400">
            ${pf.toLocaleString()}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {producto.stock === 0 ? (
            <button
              disabled
              aria-disabled="true"
              className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 py-2.5 text-sm font-semibold text-zinc-500"
            >
              Agotado
            </button>
          ) : (
            <>
              <BotonCarrito producto={{ ...producto, precio: pf }} />
              <button
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const { setItems } = useCompraRapida.getState();
                  setItems([{ ...producto, precio: pf, cantidad: 1 }]);
                  window.location.href = "/checkout/rapido";
                }}
                className="flex w-full items-center justify-center gap-1 rounded-xl border border-green-600 bg-green-600 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
              >
                <Zap size={13} aria-hidden="true" /> Comprar ahora
              </button>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}

function ProductoCardList({ producto }) {
  const pf = precioFinal(producto);

  return (
    <article
      className={`group flex gap-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:bg-white dark:hover:bg-zinc-800 ${
        producto.stock === 0 ? "opacity-70" : ""
      }`}
    >
      <Link href={`/productos/${producto.id}`} className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl shimmer-bg">
        <Image
          src={producto.imagen}
          alt={`${producto.nombre} - ${producto.categoria || "Producto"}`}
          width={180}
          height={180}
          unoptimized
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="min-w-0 flex-1">
        {producto.categoria && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {producto.categoria}
          </p>
        )}
        <Link href={`/productos/${producto.id}`}>
          <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-white transition hover:text-green-600 dark:hover:text-green-400">
            {producto.nombre}
          </h2>
        </Link>

        <div className="mt-2 flex items-center gap-3">
          {producto.descuento > 0 && (
            <span className="text-xs text-zinc-500 line-through">
              ${Number(producto.precio).toLocaleString()}
            </span>
          )}
          <span className="text-xl font-black text-zinc-900 dark:text-green-400">
            ${pf.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex w-40 flex-shrink-0 flex-col justify-center gap-2">
        {producto.stock === 0 ? (
          <button
            disabled
            aria-disabled="true"
            className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 py-2 text-sm font-semibold text-zinc-500"
          >
            Agotado
          </button>
        ) : (
          <>
            <BotonCarrito producto={{ ...producto, precio: pf }} />
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                const { setItems } = useCompraRapida.getState();
                setItems([{ ...producto, precio: pf, cantidad: 1 }]);
                window.location.href = "/checkout/rapido";
              }}
              className="flex w-full items-center justify-center gap-1 rounded-xl border border-green-600 bg-green-600 py-2 text-xs font-bold text-white transition hover:bg-green-700"
            >
              <Zap size={12} aria-hidden="true" /> Comprar ahora
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function ProductosListado({ productos: initialProductos, searchParams }) {
  const [productos, setProductos] = useState(initialProductos || []);
  const [busqueda, setBusqueda] = useState(searchParams?.q || "");
  const [categoriaActiva, setCategoriaActiva] = useState(searchParams?.categoria || "Todos");
  const [orden, setOrden] = useState("default");
  const [vista, setVista] = useState("grid");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    const timer = setTimeout(() => {
      setProductos(initialProductos || []);
      setCargando(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [initialProductos]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVista("grid");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        return coincideBusqueda && coincideCategoria;
      })
      .sort((a, b) => {
        if (orden === "precio-asc") return a.precio - b.precio;
        if (orden === "precio-desc") return b.precio - a.precio;
        if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
        if (orden === "descuento") return b.descuento - a.descuento;
        return 0;
      });
  }, [productos, busqueda, categoriaActiva, orden]);

  const itemsPorPagina = vista === "grid" ? 8 : 6;
  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / itemsPorPagina));

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaActiva, orden, vista]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const inicio = (paginaActual - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(inicio, inicio + itemsPorPagina);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-950 px-4 pt-6 pb-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Catálogo <span className="text-green-600 dark:text-green-400">Premium</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            {productosFiltrados.length} productos encontrados
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 pl-10 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-green-500 dark:focus:border-green-500 focus:outline-none"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white p-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>

          <select
            value={orden}
            onChange={(event) => setOrden(event.target.value)}
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-800 dark:text-white focus:border-green-500 dark:focus:border-green-500 focus:outline-none"
            aria-label="Ordenar productos"
          >
            <option value="default">Ordenar por</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A-Z</option>
            <option value="descuento">Mayor descuento</option>
          </select>

          <div className="inline-flex gap-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1" role="group" aria-label="Cambiar vista de productos">
            <button
              type="button"
              onClick={() => setVista("grid")}
              aria-pressed={vista === "grid"}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                vista === "grid"
                    ? "bg-green-600 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              aria-label="Vista de cuadrícula"
            >
              <Grid size={15} aria-hidden="true" /> Grid
            </button>
            <button
              type="button"
              onClick={() => setVista("lista")}
              aria-pressed={vista === "lista"}
              className={`hidden md:inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                vista === "lista"
                    ? "bg-green-600 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              aria-label="Vista de lista"
            >
              <List size={15} aria-hidden="true" /> Lista
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaActiva(categoria)}
              aria-pressed={categoriaActiva === categoria}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                categoriaActiva === categoria
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 hover:border-green-500 dark:hover:border-green-500"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {cargando ? (
          vista === "grid" ? <ProductGridSkeleton count={8} /> : <ProductListSkeleton count={6} />
        ) : productosFiltrados.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 text-center">
            <Search size={40} className="mx-auto text-zinc-300 dark:text-zinc-500" aria-hidden="true" />
            <p className="mt-4 text-lg font-semibold text-zinc-700 dark:text-white">
              No encontramos productos con esos filtros
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Intenta cambiar la búsqueda o seleccionar otra categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setCategoriaActiva("Todos");
                setOrden("default");
              }}
              className="mt-5 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
            >
              Restablecer filtros
            </button>
          </div>
        ) : vista === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosPaginados.map((producto) => (
              <ProductoCardGrid key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {productosPaginados.map((producto) => (
              <ProductoCardList key={producto.id} producto={producto} />
            ))}
          </div>
        )}

        {!cargando && productosFiltrados.length > 0 && (
          <ProductsPagination
            currentPage={paginaActual}
            totalPages={totalPaginas}
            onPageChange={setPaginaActual}
          />
        )}
      </section>
    </div>
  );
}
