"use client";

import { useState, useEffect } from "react";
import { useProductos } from "../store/productosStore";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Upload,
  Search,
  TrendingUp,
  AlertTriangle,
  Box,
  Tag,
  X,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";

import { eliminarImagenStorage } from "../lib/supabase"

const productoVacio = {
  nombre: "",
  precio: "",
  descuento: 0,
  descripcion: "",
  imagen: "",
  imagenes: [],
  categoria: "",
  stock: "",
  video_tiktok: "",
}

export default function Admin() {
  const {
    productos,
    cargarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  } = useProductos();
  const [verificando, setVerificando] = useState(true);
  const [vista, setVista] = useState("dashboard");
  const [formulario, setFormulario] = useState(productoVacio);
  const [editando, setEditando] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const router = useRouter();
  const [pedidos, setPedidos] = useState([])
const [cargandoPedidos, setCargandoPedidos] = useState(false)

  useEffect(() => {
    const verificarSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setVerificando(false);
        cargarProductos();
      }
    };
    verificarSesion();
  }, []);


  const cargarPedidos = async () => {
    setCargandoPedidos(true)
    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })
    if (data) setPedidos(data)
    setCargandoPedidos(false)
  }

  useEffect(() => {
    if (vista === "pedidos") cargarPedidos()
  }, [vista])

  if (verificando) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-green-400 font-mono animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // Estadísticas
  const totalProductos = productos.length;
  const totalStock = productos.reduce((acc, p) => acc + Number(p.stock), 0);
  const productosConDescuento = productos.filter((p) => p.descuento > 0).length;
  const stockBajo = productos.filter((p) => p.stock <= 3).length;
  const valorInventario = productos.reduce(
    (acc, p) => acc + Number(p.precio) * Number(p.stock),
    0,
  );

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setSubiendoImagen(true);
    setPreview(URL.createObjectURL(archivo));
    const extension = archivo.name.split(".").pop();
    const nombreArchivo = `${Date.now()}.${extension}`;
    const { error } = await supabase.storage
      .from("productos")
      .upload(nombreArchivo, archivo);
    if (error) {
      setSubiendoImagen(false);
      return;
    }
    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(nombreArchivo);
    setFormulario({ ...formulario, imagen: data.publicUrl });
    setSubiendoImagen(false);
  };

  const handleImagenAdicional = async (e, indice) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendoImagen(true);
    const extension = archivo.name.split(".").pop();
    const nombreArchivo = `${Date.now()}-${indice}.${extension}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(nombreArchivo, archivo);

    if (error) {
      setSubiendoImagen(false);
      return;
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(nombreArchivo);

    const nuevasImagenes = [...(formulario.imagenes || [])];
    nuevasImagenes[indice] = data.publicUrl;

    const actualizado = {
      ...formulario,
      imagenes: nuevasImagenes,
    };

    // La primera imagen es la portada
    if (indice === 0) {
      actualizado.imagen = data.publicUrl;
      setPreview(data.publicUrl);
    }

    setFormulario(actualizado);
    setSubiendoImagen(false);
  };

  const eliminarImagenAdicional = async (indice) => {
  const url = formulario.imagenes[indice]
  await eliminarImagenStorage(url)

  const nuevasImagenes = formulario.imagenes.filter((_, i) => i !== indice)
  const actualizado = { ...formulario, imagenes: nuevasImagenes }

  // Si se elimina la portada actualiza imagen principal
  if (indice === 0) {
    actualizado.imagen = nuevasImagenes[0] || ""
    setPreview(nuevasImagenes[0] || null)
  }

  setFormulario(actualizado)
}

  const handleSubmit = async () => {
    if (!formulario.nombre || !formulario.precio) return;
    if (editando) {
      await editarProducto({ ...formulario, id: editando });
      setEditando(null);
    } else {
      await agregarProducto(formulario);
    }
    setFormulario(productoVacio);
    setPreview(null);
    setVista("productos");
  };

  const handleEditar = (producto) => {
    setFormulario(producto);
    setPreview(producto.imagen);
    setEditando(producto.id);
    setVista("formulario");
  };

  const handleCancelar = () => {
    setFormulario(productoVacio);
    setPreview(null);
    setEditando(null);
    setVista("productos");
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col min-h-screen sticky top-0">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-black">
            COAM<span className="text-green-400">TEC</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1">Panel de administración</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {[
            {
              id: "dashboard",
              icon: <LayoutDashboard size={18} />,
              label: "Dashboard",
            },
            {
              id: "productos",
              icon: <Package size={18} />,
              label: "Productos",
            },
            {
              id: "formulario",
              icon: <Plus size={18} />,
              label: "Agregar producto",
            },
            { id: "pedidos", icon: <ShoppingBag size={18} />, label: "Pedidos" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id !== "formulario") {
                  setEditando(null);
                  setFormulario(productoVacio);
                  setPreview(null);
                }
                setVista(item.id);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                vista === item.id
                  ? "bg-green-400 text-black"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Dashboard */}
        {vista === "dashboard" && (
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-black">Dashboard</h2>
              <p className="text-zinc-500 text-sm mt-1">Resumen de tu tienda</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total productos",
                  value: totalProductos,
                  icon: <Box size={24} />,
                  color: "text-blue-400",
                },
                {
                  label: "Unidades en stock",
                  value: totalStock,
                  icon: <Package size={24} />,
                  color: "text-green-400",
                },
                {
                  label: "Con descuento",
                  value: productosConDescuento,
                  icon: <Tag size={24} />,
                  color: "text-yellow-400",
                },
                {
                  label: "Stock bajo",
                  value: stockBajo,
                  icon: <AlertTriangle size={24} />,
                  color: "text-red-400",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-zinc-500 text-sm">{stat.label}</p>
                      <p className={`text-3xl font-black mt-1 ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Valor inventario */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">
                  Valor total del inventario
                </p>
                <p className="text-4xl font-black text-green-400 mt-1">
                  ${valorInventario.toLocaleString()}
                </p>
              </div>
              <TrendingUp size={48} className="text-green-400/20" />
            </div>

            {/* Productos con stock bajo */}
            {stockBajo > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-red-400 font-bold mb-4">
                  ⚡ Productos con stock bajo
                </h3>
                <div className="flex flex-col gap-2">
                  {productos
                    .filter((p) => p.stock <= 3)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-zinc-300">{p.nombre}</span>
                        <span className="text-red-400 font-bold">
                          {p.stock} unidades
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Productos recientes */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Productos recientes</h3>
              <div className="flex flex-col gap-3">
                {productos.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-200 text-sm font-medium truncate">
                        {p.nombre}
                      </p>
                      <p className="text-zinc-500 text-xs">{p.categoria}</p>
                    </div>
                    <p className="text-green-400 font-bold text-sm">
                      ${Number(p.precio).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lista productos */}
        {vista === "productos" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black">Productos</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  {productos.length} productos en total
                </p>
              </div>
              <button
                onClick={() => setVista("formulario")}
                className="bg-green-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-green-300 transition flex items-center gap-2"
              >
                <Plus size={18} />
                Agregar producto
              </button>
            </div>

            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400 transition"
              />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 text-sm font-medium px-6 py-4">
                      Producto
                    </th>
                    <th className="text-left text-zinc-500 text-sm font-medium px-6 py-4">
                      Categoría
                    </th>
                    <th className="text-left text-zinc-500 text-sm font-medium px-6 py-4">
                      Precio
                    </th>
                    <th className="text-left text-zinc-500 text-sm font-medium px-6 py-4">
                      Stock
                    </th>
                    <th className="text-left text-zinc-500 text-sm font-medium px-6 py-4">
                      Descuento
                    </th>
                    <th className="text-left text-zinc-500 text-sm font-medium px-6 py-4">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto, i) => (
                    <tr
                      key={producto.id}
                      className={`border-b border-zinc-800/50 hover:bg-zinc-800/50 transition ${
                        i === productosFiltrados.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <span className="text-zinc-200 text-sm font-medium">
                            {producto.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 text-xs font-mono bg-green-400/10 px-2 py-1 rounded-full">
                          {producto.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-200 text-sm font-bold">
                        ${Number(producto.precio).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-bold ${producto.stock <= 3 ? "text-red-400" : "text-zinc-200"}`}
                        >
                          {producto.stock}
                          {producto.stock <= 3 && (
                            <span className="text-xs ml-1">⚡</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {producto.descuento > 0 ? (
                          <span className="text-yellow-400 text-sm font-bold">
                            -{producto.descuento}%
                          </span>
                        ) : (
                          <span className="text-zinc-600 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditar(producto)}
                            className="bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-zinc-600 transition flex items-center gap-1"
                          >
                            <Edit size={12} />
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarProducto(producto.id)}
                            className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/30 transition flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Formulario */}
        {vista === "formulario" && (
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <h2 className="text-3xl font-black">
                {editando ? "Editar producto" : "Agregar producto"}
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                {editando
                  ? "Modifica los datos del producto"
                  : "Completa el formulario para agregar un nuevo producto"}
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
              {/* Imagen */}
              {/* Imágenes del producto */}
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-sm font-medium">
                  Imágenes del producto (la primera será la portada)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((indice) => (
                    <div key={indice} className="relative">
                      {formulario.imagenes?.[indice] ? (
                        <div className="relative aspect-square">
                          {indice === 0 && (
                            <span className="absolute -top-2 -left-2 bg-green-400 text-black text-xs font-black px-2 py-0.5 rounded-full z-10">
                              Portada
                            </span>
                          )}
                          <img
                            src={formulario.imagenes[indice]}
                            alt={`imagen ${indice + 1}`}
                            className="w-full h-full object-cover rounded-xl border-2 border-zinc-700"
                          />
                          <button
                            onClick={() => eliminarImagenAdicional(indice)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                          >
                            <X size={12} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <label
                          className={`aspect-square flex flex-col items-center justify-center bg-zinc-800 border-2 border-dashed rounded-xl transition ${
                            (formulario.imagenes || []).length >= indice
                              ? "border-zinc-600 hover:border-green-400 cursor-pointer"
                              : "border-zinc-800 opacity-40 cursor-not-allowed"
                          }`}
                        >
                          <Plus size={20} className="text-zinc-500" />
                          <span className="text-zinc-500 text-xs mt-1">
                            {indice === 0 ? "Portada" : `Foto ${indice + 1}`}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImagenAdicional(e, indice)}
                            className="hidden"
                            disabled={
                              subiendoImagen ||
                              (formulario.imagenes || []).length < indice
                            }
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-zinc-600 text-xs">
                  Sube hasta 3 fotos. La primera aparecerá como imagen
                  principal.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-sm font-medium">
                  Nombre
                </label>
                <input
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Precio
                  </label>
                  <input
                    name="precio"
                    value={formulario.precio}
                    onChange={handleChange}
                    placeholder="0"
                    type="number"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Descuento %
                  </label>
                  <input
                    name="descuento"
                    value={formulario.descuento}
                    onChange={handleChange}
                    placeholder="0"
                    type="number"
                    min="0"
                    max="100"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Categoría
                  </label>
                  <input
                    name="categoria"
                    value={formulario.categoria}
                    onChange={handleChange}
                    placeholder="Ej: Teclados"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Stock
                  </label>
                  <input
                    name="stock"
                    value={formulario.stock}
                    onChange={handleChange}
                    placeholder="0"
                    type="number"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-sm font-medium">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={handleChange}
                  placeholder="Describe el producto..."
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                  rows={4}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-sm font-medium">Video TikTok (opcional)</label>
                <input
                  name="video_tiktok"
                  value={formulario.video_tiktok || ""}
                  onChange={handleChange}
                  placeholder="https://www.tiktok.com/@usuario/video/123456"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                />
                <p className="text-zinc-600 text-xs">Pega la URL del video de TikTok de tu producto</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={subiendoImagen}
                  className="bg-green-400 text-black font-bold py-3 px-8 rounded-xl hover:bg-green-300 transition disabled:opacity-50"
                >
                  {editando ? "Guardar cambios" : "Agregar producto"}
                </button>
                <button
                  onClick={handleCancelar}
                  className="bg-zinc-800 text-zinc-400 py-3 px-8 rounded-xl hover:bg-zinc-700 hover:text-white transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vista Pedidos */}
{vista === "pedidos" && (
  <div className="flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-black text-white">Pedidos</h2>
      <button
        onClick={cargarPedidos}
        className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm hover:bg-zinc-700 transition flex items-center gap-2"
      >
        <RotateCcw size={14} />
        Actualizar
      </button>
    </div>

    {/* Stats rápidos */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        {
          label: "Total pedidos",
          value: pedidos.length,
          color: "text-blue-400",
        },
        {
          label: "Pagados",
          value: pedidos.filter(p => p.estado === "pagado").length,
          color: "text-green-400",
        },
        {
          label: "Pendientes",
          value: pedidos.filter(p => p.estado === "pendiente").length,
          color: "text-yellow-400",
        },
        {
          label: "Total ventas",
          value: `$${pedidos.filter(p => p.estado === "pagado").reduce((acc, p) => acc + p.total, 0).toLocaleString()}`,
          color: "text-green-400",
        },
      ].map((stat) => (
        <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-sm">{stat.label}</p>
          <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>

    {/* Tabla pedidos */}
    {cargandoPedidos ? (
      <p className="text-zinc-500 text-center py-12 animate-pulse">Cargando pedidos...</p>
    ) : pedidos.length === 0 ? (
      <div className="text-center py-12">
        <ShoppingBag size={48} className="text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-500">No hay pedidos aún</p>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4"
          >
            {/* Header pedido */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">#{pedido.id} - {pedido.nombre}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    pedido.estado === "pagado"
                      ? "bg-green-400/20 text-green-400"
                      : pedido.estado === "rechazado"
                      ? "bg-red-400/20 text-red-400"
                      : "bg-yellow-400/20 text-yellow-400"
                  }`}>
                    {pedido.estado}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm mt-1">{pedido.email} · {pedido.telefono}</p>
                <p className="text-zinc-500 text-sm">{pedido.direccion}, {pedido.ciudad}, {pedido.departamento}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-green-400 font-black text-xl">${pedido.total?.toLocaleString()}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {new Date(pedido.created_at).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Productos */}
            <div className="border-t border-zinc-800 pt-3">
              <p className="text-zinc-500 text-xs mb-2 uppercase tracking-widest font-mono">Productos</p>
              <div className="flex flex-col gap-2">
                {pedido.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-300 text-sm truncate">{item.nombre}</p>
                      <p className="text-zinc-500 text-xs">x{item.cantidad}</p>
                    </div>
                    <p className="text-zinc-300 text-sm font-bold flex-shrink-0">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
              <div className="flex gap-4 text-xs text-zinc-500">
                <span>Envío: <span className="text-zinc-300">{pedido.metodo_envio || "estándar"}</span></span>
                <span>Pago: <span className="text-zinc-300">{pedido.metodo_pago || "MercadoPago"}</span></span>
              </div>
              <select
                value={pedido.estado}
                onChange={async (e) => {
                  const nuevoEstado = e.target.value
                  await supabase
                    .from("pedidos")
                    .update({ estado: nuevoEstado })
                    .eq("id", pedido.id)
                  cargarPedidos()
                }}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-300 text-xs focus:outline-none focus:border-green-400 cursor-pointer"
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
      </main>
    </div>
  );
}
