"use client";

import { useEffect, useState } from "react";
import BotonCarrito from "./BotonCarrito";
import { useCarrito } from "../store/carritoStore";
import Link from "next/link";
import { Search, X, Grid, List, Zap } from "lucide-react";
import { useCompraRapida } from "../store/compraRapidaStore";

export default function ProductosListado({ productos: initialProductos, searchParams }) {
  const [productos, setProductos] = useState(initialProductos || []);
  const [busqueda, setBusqueda] = useState(searchParams?.q || "");
  const [categoriaActiva, setCategoriaActiva] = useState(searchParams?.categoria || "Todos");
  const [orden, setOrden] = useState("default");
  const [vista, setVista] = useState("grid");

  useEffect(() => {
    // actualiza productos si cambia la prop inicial (raro pero seguro)
    setProductos(initialProductos);
  }, [initialProductos]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVista("grid");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categorias = [
    "Todos",
    ...new Set(productos.map((p) => p.categoria).filter(Boolean)),
  ];

  const productosFiltrados = productos
    .filter((p) => {
      const coincideBusqueda =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria =
        categoriaActiva === "Todos" || p.categoria === categoriaActiva;
      return coincideBusqueda && coincideCategoria;
    })
    .sort((a, b) => {
      if (orden === "precio-asc") return a.precio - b.precio;
      if (orden === "precio-desc") return b.precio - a.precio;
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "descuento") return b.descuento - a.descuento;
      return 0;
    });

  const precioFinal = (producto) => {
    return producto.descuento > 0
      ? producto.precio - (producto.precio * producto.descuento) / 100
      : producto.precio;
  };

  if (!productos) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-zinc-300 to-zinc-200 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-400 dark:border-zinc-800 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black mb-2">
            Nuestros <span className="text-green-400">Productos</span>
          </h1>
          <p className="text-zinc-500 text-sm">
            {productosFiltrados.length} productos encontrados
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Controles */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Buscador */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />
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
            className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-300 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition cursor-pointer"
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
              className={`px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2 cursor-pointer ${
                vista === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Grid size={16} /> Grid
            </button>
            <button
              onClick={() => setVista("lista")}
              className={`hidden md:flex px-4 py-2 rounded-lg transition font-medium text-sm items-center gap-2 cursor-pointer ${
                vista === "lista"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
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
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
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
            <p className="text-zinc-400 text-lg">
              No encontramos productos con esa búsqueda
            </p>
            <button
              onClick={() => {
                setBusqueda("");
                setCategoriaActiva("Todos");
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Vista Grid */}
        {vista === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => {
              const pf = precioFinal(producto);

              return (
                <Link
                  key={producto.id}
                  href={`/productos/${producto.id}`}
                  className="group"
                >
                  <article
                    className={`bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative transition shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-300 ${
                      producto.stock === 0
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {/* Badges - only if not sold out */}
                  {producto.stock > 0 && producto.descuento > 0 && (
                    <span className="absolute top-3 right-3 bg-green-400 text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                      -{producto.descuento}%
                    </span>
                  )}
                  {producto.stock <= 3 && producto.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      ⚡ Últimas
                    </span>
                  )}

                  {/* Imagen */}
                  <div className="relative overflow-hidden rounded-xl">
                    {producto.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-20">
                        <span className="bg-zinc-900 border border-zinc-700 text-zinc-400 font-black px-4 py-2 rounded-full text-sm">
                          Agotado
                        </span>
                      </div>
                    )}
                    <img
                      src={producto.imagen}
                      alt={`${producto.nombre} - ${producto.categoria}`}
                      loading="lazy"
                      width="400"
                      height="300"
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <h2 className="text-zinc-800 dark:text-zinc-100 font-semibold hover:text-green-400 transition leading-tight">
                    {producto.nombre}
                  </h2>
                  <span className="text-xs text-green-400 font-mono uppercase font-bold">
                    {producto.categoria}
                  </span>
                  <div className="flex flex-col mt-auto">
                    {producto.descuento > 0 && (
                      <span className="text-xs text-zinc-400 dark:text-zinc-600 line-through">
                        ${Number(producto.precio).toLocaleString()}
                      </span>
                    )}
                    <span className="text-xl font-bold text-green-400">
                      ${pf.toLocaleString()}
                    </span>
                  </div>

                  {/* Botón deshabilitado si está agotado */}
                  {producto.stock === 0 ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-sm font-medium cursor-not-allowed"
                    >
                      Sin stock
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <BotonCarrito
                        producto={{ ...producto, precio: pf }}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const { setItems } = useCompraRapida.getState();
                          setItems([
                            { ...producto, precio: pf, cantidad: 1 },
                          ]);
                          window.location.href = "/checkout/rapido";
                        }}
                        className="w-full py-2.5 rounded-xl border-2 border-red-600 bg-red-600 text-white text-sm font-bold hover:bg-red-700 hover:border-red-700 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Zap size={12} />
                        Comprar ahora
                      </button>
                    </div>
                  )}
                </article>
                </Link>
              );
            })}
          </div>
        )}

        {/* Vista Lista */}
        {vista === "lista" && (
          <div className="flex flex-col gap-4">
            {productosFiltrados.map((producto) => {
              const pf = precioFinal(producto);

              return (
                <article
                  key={producto.id}
                  className={`bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-800 rounded-xl p-4 flex gap-6 items-center transition group shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-300 ${
                    producto.stock === 0
                      ? "opacity-60"
                      : ""
                  }`}
                >
                  <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl">
                    {producto.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-20">
                        <span className="bg-zinc-900 border border-zinc-700 text-zinc-400 font-black px-3 py-1 rounded-full text-xs">
                          Agotado
                        </span>
                      </div>
                    )}
                    <img
                      src={producto.imagen}
                      alt={`${producto.nombre} - ${producto.categoria}`}
                      loading="lazy"
                      width="100"
                      height="100"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/productos/${producto.id}`}>    
                      <h2 className="text-zinc-800 dark:text-zinc-100 font-semibold text-lg hover:text-green-400 transition">
                        {producto.nombre}
                      </h2>
                    </Link>
                    <span className="text-xs text-green-400 font-mono uppercase font-bold mt-1 inline-block">
                      {producto.categoria}
                    </span>
                    <div className="flex items-center gap-3 mt-2">
                      {producto.stock === 0 && (
                        <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 text-xs px-2 py-1 rounded-full">
                          Agotado
                        </span>
                      )}
                      {producto.stock <= 3 && producto.stock > 0 && (
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                          ⚡ Últimas unidades
                        </span>
                      )}
                      {producto.stock > 0 && producto.descuento > 0 && (
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
                      ${pf.toLocaleString()}
                    </span>
                    {producto.stock === 0 ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-sm font-medium cursor-not-allowed"
                      >
                        Sin stock
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2 items-end w-40">
                        <BotonCarrito
                          producto={{ ...producto, precio: pf }}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const { setItems } = useCompraRapida.getState();
                            setItems([
                              { ...producto, precio: pf, cantidad: 1 },
                            ]);
                            window.location.href = "/checkout/rapido";
                          }}
                          className="w-full py-2 rounded-xl border-2 border-red-600 bg-red-600 text-white text-xs font-bold hover:bg-red-700 hover:border-red-700 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Zap size={12} />
                          Comprar ahora
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
