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
  Search,
  TrendingUp,
  AlertTriangle,
  Box,
  Tag,
  X,
  ShoppingBag,
  RotateCcw,
  Eye,
  Users,
  Star,
  Image as ImageIcon,
  Video,
  Youtube,
  Upload,
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
  video: "",
  video_tiktok: "",
  peso: "",
  alto: "",
  ancho: "",
  largo: "",
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
  const [subiendoVideo, setSubiendoVideo] = useState(false);
  const [preview, setPreview] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testEmailStatus, setTestEmailStatus] = useState(null);
  const router = useRouter();
  const [pedidos, setPedidos] = useState([])
  const [cargandoPedidos, setCargandoPedidos] = useState(false)

  const [analytics, setAnalytics] = useState({
    totalVisitas: 0,
    visitasHoy: 0,
    visitasUnicas: 0,
    visitasUnicasHoy: 0,
    topPaginas: [],
  })

  // Estado para producto destacado
  const [productoDestacado, setProductoDestacado] = useState(null)
  const [cargandoDestacado, setCargandoDestacado] = useState(false)
  const [guardandoDestacado, setGuardandoDestacado] = useState(false)
  const [formDestacado, setFormDestacado] = useState({
    producto_id: "",
    imagen_destacada: "",
    tagline: "",
    caracteristicas: ["", "", ""],
  })

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

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}
  }

  const cargarPedidos = async () => {
    setCargandoPedidos(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch("/api/pedidos", { headers })
      const data = await res.json()
      if (res.ok) setPedidos(data)
    } catch (err) {
      console.error("Error cargando pedidos:", err)
    }
    setCargandoPedidos(false)
  }

  const cargarAnalytics = async () => {
    try {
      const headers = await getAuthHeaders()
      const res = await fetch("/api/analytics", { headers })
      const data = await res.json()
      if (res.ok) setAnalytics(data)
    } catch (err) {
      console.error("Error cargando analytics:", err)
    }
  }

  useEffect(() => {
    if (vista === "pedidos") cargarPedidos()
  }, [vista])

  useEffect(() => {
    if (vista === "dashboard") cargarAnalytics()
  }, [vista])

  // Cargar producto destacado
  const cargarProductoDestacado = async () => {
    setCargandoDestacado(true)
    try {
      const res = await fetch("/api/producto-destacado")
      const data = await res.json()
      if (data) {
        setProductoDestacado(data)
        setFormDestacado({
          producto_id: data.id,
          imagen_destacada: data.imagen_destacada || "",
          tagline: data.tagline || "",
          caracteristicas: data.caracteristicas?.length === 3 ? data.caracteristicas : ["", "", ""],
        })
      }
    } catch (err) {
      console.error("Error cargando producto destacado:", err)
    }
    setCargandoDestacado(false)
  }

  useEffect(() => {
    if (vista === "destacado") cargarProductoDestacado()
  }, [vista])

  // Subir imagen destacada
  const handleImagenDestacada = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    setGuardandoDestacado(true)
    const extension = archivo.name.split(".").pop()
    const nombreArchivo = `destacado-${Date.now()}.${extension}`

    const { error } = await supabase.storage
      .from("productos")
      .upload(nombreArchivo, archivo)

    if (error) {
      setGuardandoDestacado(false)
      return
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(nombreArchivo)

    setFormDestacado(prev => ({ ...prev, imagen_destacada: data.publicUrl }))
    setGuardandoDestacado(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps

  // Guardar producto destacado
  const guardarProductoDestacado = async () => {
    if (!formDestacado.producto_id) {
      alert("Selecciona un producto")
      return
    }

    setGuardandoDestacado(true)
    try {
      const res = await fetch("/api/producto-destacado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: formDestacado.producto_id,
          imagen_destacada: formDestacado.imagen_destacada,
          tagline: formDestacado.tagline,
          caracteristicas: formDestacado.caracteristicas.filter(c => c.trim() !== ""),
        }),
      })

      if (res.ok) {
        alert("¡Producto destacado guardado!")
        cargarProductoDestacado()
      } else {
        const data = await res.json()
        alert("Error: " + data.error)
      }
    } catch (err) {
      console.error("Error guardando:", err)
      alert("Error al guardar")
    }
    setGuardandoDestacado(false)
  }

  if (verificando) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-green-400 font-mono animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );
  }

  const totalProductos = productos.length;
  const totalStock = productos.reduce((acc, p) => acc + Number(p.stock), 0);
  const productosConDescuento = productos.filter((p) => p.descuento > 0).length;
  const stockBajo = productos.filter((p) => p.stock <= 3 && p.stock > 0).length
  const valorInventario = productos.reduce(
    (acc, p) => acc + Number(p.precio) * Number(p.stock),
    0,
  );
  const agotados = productos.filter((p) => p.stock === 0).length

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

    if (indice === 0) {
      actualizado.imagen = nuevasImagenes[0] || ""
      setPreview(nuevasImagenes[0] || null)
    }

    setFormulario(actualizado)
  }

  // Subir video a Supabase
  const handleVideoUpload = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    // Validar tamaño (máximo 50MB)
    if (archivo.size > 50 * 1024 * 1024) {
      alert("El video no puede superar los 50MB")
      return
    }

    setSubiendoVideo(true)
    const extension = archivo.name.split(".").pop()
    const nombreArchivo = `video-${Date.now()}.${extension}`

    const { error } = await supabase.storage
      .from("productos")
      .upload(nombreArchivo, archivo)

    if (error) {
      alert("Error al subir el video")
      setSubiendoVideo(false)
      return
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(nombreArchivo)

    setFormulario(prev => ({ ...prev, video: data.publicUrl }))
    setSubiendoVideo(false)
  }

  const pingSearchEngines = async () => {
    try {
      await fetch("/api/ping-sitemap", { method: "POST" });
    } catch (e) {
      // Silent fail
    }
  };

  const handleSubmit = async () => {
    if (!formulario.nombre || !formulario.precio) return;

    const datosLimpios = {
      ...formulario,
      precio: Number(formulario.precio) || 0,
      descuento: Number(formulario.descuento) || 0,
      stock: Number(formulario.stock) || 0,
      peso: Number(formulario.peso) || 0,
      alto: Number(formulario.alto) || 0,
      ancho: Number(formulario.ancho) || 0,
      largo: Number(formulario.largo) || 0,
    }

    let ok = false
    if (editando) {
      ok = await editarProducto({ ...datosLimpios, id: editando });
      if (ok) setEditando(null);
    } else {
      ok = await agregarProducto(datosLimpios);
    }

    if (ok) {
      pingSearchEngines();
      setFormulario(productoVacio);
      setPreview(null);
      setVista("productos");
    }
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
              id: "destacado",
              icon: <Star size={18} />,
              label: "Producto Destacado",
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
            {/* Botón de prueba de email */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-4">
              <span className="text-white font-bold mr-4">Probar email de confirmación</span>
              <button
                className="bg-green-400 hover:bg-green-300 text-black font-bold px-4 py-2 rounded-lg transition"
                onClick={() => setShowTestEmail(true)}
              >
                Probar email
              </button>
            </div>

            {showTestEmail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-md shadow-xl flex flex-col gap-4">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-zinc-500 hover:text-red-400"
                    onClick={() => {
                      setShowTestEmail(false);
                      setTestEmail("");
                      setTestEmailStatus(null);
                    }}
                  >
                    <span className="sr-only">Cerrar</span>
                    <X size={24} />
                  </button>
                  <h3 className="text-xl font-bold text-white mb-2">Enviar email de prueba</h3>
                  <input
                    type="email"
                    placeholder="Email destinatario"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-400"
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                  />
                  <button
                    className="bg-green-400 hover:bg-green-300 text-black font-bold px-4 py-2 rounded-lg transition mt-2"
                    onClick={async () => {
                      setTestEmailStatus("cargando");
                      try {
                        const res = await fetch("/api/test-email", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: testEmail })
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setTestEmailStatus("exito");
                        } else {
                          setTestEmailStatus(data.error || "error");
                        }
                      } catch (err) {
                        setTestEmailStatus("error");
                      }
                    }}
                    disabled={!testEmail || testEmailStatus === "cargando"}
                  >
                    {testEmailStatus === "cargando" ? "Enviando..." : "Enviar"}
                  </button>
                  {testEmailStatus === "exito" && (
                    <div className="text-green-400 font-bold mt-2">¡Email enviado correctamente!</div>
                  )}
                  {testEmailStatus && testEmailStatus !== "exito" && testEmailStatus !== "cargando" && (
                    <div className="text-red-400 font-bold mt-2">{testEmailStatus}</div>
                  )}
                </div>
              </div>
            )}

            {/* Card valor inventario */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">
                  Valor total del inventario
                </p>
                <p className="text-4xl font-black text-green-400 mt-1">
                  ${valorInventario.toLocaleString()}
                </p>
              </div>
              <span className="text-green-400 text-4xl">↑</span>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-500 text-sm">Visitas totales</p>
                    <p className="text-3xl font-black mt-1 text-purple-400">
                      {analytics.totalVisitas.toLocaleString()}
                    </p>
                  </div>
                  <Eye size={24} className="text-purple-400" />
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-500 text-sm">Visitas hoy</p>
                    <p className="text-3xl font-black mt-1 text-purple-400">
                      {analytics.visitasHoy.toLocaleString()}
                    </p>
                  </div>
                  <Eye size={24} className="text-purple-400" />
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-500 text-sm">Visitantes únicos</p>
                    <p className="text-3xl font-black mt-1 text-cyan-400">
                      {analytics.visitasUnicas.toLocaleString()}
                    </p>
                  </div>
                  <Users size={24} className="text-cyan-400" />
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-500 text-sm">Únicos hoy</p>
                    <p className="text-3xl font-black mt-1 text-cyan-400">
                      {analytics.visitasUnicasHoy.toLocaleString()}
                    </p>
                  </div>
                  <Users size={24} className="text-cyan-400" />
                </div>
              </div>
            </div>

            {/* Top páginas */}
            {analytics.topPaginas.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Páginas más visitadas</h3>
                <div className="flex flex-col gap-2">
                  {analytics.topPaginas.map((p, i) => (
                    <div key={p.page} className="flex justify-between items-center text-sm">
                      <span className="text-zinc-300 flex items-center gap-2">
                        <span className="text-zinc-600 font-mono text-xs">{i + 1}.</span>
                        {p.page}
                      </span>
                      <span className="text-purple-400 font-bold">{p.count} visitas</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

        {/* Producto Destacado */}
        {vista === "destacado" && (
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <h2 className="text-3xl font-black">Producto Destacado</h2>
              <p className="text-zinc-500 text-sm mt-1">
                Configura el producto que aparece en la página principal
              </p>
            </div>

            {cargandoDestacado ? (
              <div className="text-zinc-500 text-center py-12 animate-pulse">
                Cargando configuración...
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6">
                {/* Producto actual */}
                {productoDestacado && (
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <p className="text-xs text-green-400 font-medium mb-2">PRODUCTO ACTUAL</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={productoDestacado.imagen_destacada || productoDestacado.imagen}
                        alt={productoDestacado.nombre}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-bold">{productoDestacado.nombre}</p>
                        <p className="text-zinc-400 text-sm">{productoDestacado.tagline}</p>
                        <p className="text-green-400 font-bold text-sm mt-1">
                          ${Number(productoDestacado.precio).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selector de producto */}
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Seleccionar producto
                  </label>
                  <select
                    value={formDestacado.producto_id}
                    onChange={(e) => setFormDestacado(prev => ({ ...prev, producto_id: e.target.value }))}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-400 cursor-pointer"
                  >
                    <option value="">-- Selecciona un producto --</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} - ${Number(p.precio).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Imagen PNG personalizada */}
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Imagen PNG para el hero (sin fondo, recomendado)
                  </label>
                  
                  {formDestacado.imagen_destacada ? (
                    <div className="relative">
                      <img
                        src={formDestacado.imagen_destacada}
                        alt="Imagen destacada"
                        className="w-full max-w-xs aspect-square object-contain rounded-xl border border-zinc-700 bg-zinc-800"
                      />
                      <button
                        onClick={() => setFormDestacado(prev => ({ ...prev, imagen_destacada: "" }))}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full max-w-xs aspect-square bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-xl cursor-pointer hover:border-green-400 transition">
                      <ImageIcon size={32} className="text-zinc-500 mb-2" />
                      <span className="text-zinc-400 text-sm">Subir imagen PNG</span>
                      <span className="text-zinc-600 text-xs mt-1">Recomendado: 800x800px</span>
                      <input
                        type="file"
                        accept="image/png,image/webp"
                        onChange={handleImagenDestacada}
                        className="hidden"
                        disabled={guardandoDestacado}
                      />
                    </label>
                  )}
                  
                  <p className="text-zinc-600 text-xs">
                    Si no subes una imagen, se usará la imagen principal del producto
                  </p>
                </div>

                {/* Tagline */}
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Subtítulo (tagline)
                  </label>
                  <input
                    type="text"
                    value={formDestacado.tagline}
                    onChange={(e) => setFormDestacado(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Ej: Switches Magnéticos Hall Effect"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                  />
                </div>

                {/* Características */}
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-sm font-medium">
                    Características destacadas (3 máximo)
                  </label>
                  <div className="flex flex-col gap-2">
                    {[0, 1, 2].map((i) => (
                      <input
                        key={i}
                        type="text"
                        value={formDestacado.caracteristicas[i] || ""}
                        onChange={(e) => {
                          const nuevas = [...formDestacado.caracteristicas]
                          nuevas[i] = e.target.value
                          setFormDestacado(prev => ({ ...prev, caracteristicas: nuevas }))
                        }}
                        placeholder={`Característica ${i + 1} (ej: 8000Hz, Rapid Trigger)`}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Botón guardar */}
                <button
                  onClick={guardarProductoDestacado}
                  disabled={guardandoDestacado || !formDestacado.producto_id}
                  className="bg-green-400 text-black font-bold py-3 px-8 rounded-xl hover:bg-green-300 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Star size={18} />
                  {guardandoDestacado ? "Guardando..." : "Guardar como destacado"}
                </button>
              </div>
            )}
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
              {/* Imágenes del producto */}
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-sm font-medium">
                  Imágenes del producto (la primera será la portada)
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {[0, 1, 2, 3, 4].map((indice) => (
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
                  Sube hasta 5 fotos. La primera aparecerá como imagen principal.
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
                <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                  Descripción
                  <span className="text-zinc-600 text-xs">(Puedes usar HTML)</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={handleChange}
                  placeholder="<h3>Título</h3><p>Describe tu producto...</p><ul><li>Característica 1</li><li>Característica 2</li></ul>"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400 font-mono text-sm"
                  rows={6}
                />
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded">&lt;h3&gt;Título&lt;/h3&gt;</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded">&lt;b&gt;negrita&lt;/b&gt;</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded">&lt;ul&gt;&lt;li&gt;lista&lt;/li&gt;&lt;/ul&gt;</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded">&lt;br/&gt; salto</span>
                </div>
              </div>

              {/* Sección de Video */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Video size={16} />
                  Video del producto (opcional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* YouTube URL */}
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                      <Youtube size={14} />
                      URL de YouTube
                    </label>
                    <input
                      name="video"
                      value={formulario.video || ""}
                      onChange={handleChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400 text-sm"
                    />
                    <p className="text-zinc-600 text-xs">Pega una URL de YouTube</p>
                  </div>

                  {/* Subir video */}
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                      <Upload size={14} />
                      Subir video (MP4, máx 50MB)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={subiendoVideo}
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className={`flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 cursor-pointer hover:border-green-400 transition ${
                          subiendoVideo ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {subiendoVideo ? (
                          <span className="text-zinc-400 text-sm">Subiendo...</span>
                        ) : (
                          <>
                            <Upload size={16} className="text-zinc-400" />
                            <span className="text-zinc-400 text-sm">Seleccionar video</span>
                          </>
                        )}
                      </label>
                    </div>
                    {formulario.video && !formulario.video.includes('youtube.com') && !formulario.video.includes('youtu.be') && (
                      <div className="flex items-center gap-2 mt-2">
                        <video 
                          src={formulario.video} 
                          className="w-20 h-20 rounded-lg object-cover"
                          muted
                        />
                        <button
                          type="button"
                          onClick={() => setFormulario(prev => ({ ...prev, video: "" }))}
                          className="text-red-400 text-xs hover:text-red-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video preview */}
                {formulario.video && (formulario.video.includes('youtube.com') || formulario.video.includes('youtu.be')) && (
                  <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <Youtube size={14} />
                      <span>Video de YouTube configurado</span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1 truncate">{formulario.video}</p>
                  </div>
                )}
              </div>

              {/* Video TikTok */}
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

              {/* Peso y dimensiones */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Package size={16} />
                  Especificaciones de envío
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-sm font-medium">
                      Peso (gramos)
                    </label>
                    <input
                      name="peso"
                      value={formulario.peso || ""}
                      onChange={handleChange}
                      placeholder="500"
                      type="number"
                      min="1"
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-sm font-medium">
                      Alto (cm)
                    </label>
                    <input
                      name="alto"
                      value={formulario.alto || ""}
                      onChange={handleChange}
                      placeholder="5"
                      type="number"
                      min="1"
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-sm font-medium">
                      Ancho (cm)
                    </label>
                    <input
                      name="ancho"
                      value={formulario.ancho || ""}
                      onChange={handleChange}
                      placeholder="25"
                      type="number"
                      min="1"
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-sm font-medium">
                      Largo (cm)
                    </label>
                    <input
                      name="largo"
                      value={formulario.largo || ""}
                      onChange={handleChange}
                      placeholder="30"
                      type="number"
                      min="1"
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>

                <p className="text-zinc-600 text-xs mt-2">
                  Estas medidas se utilizarán para calcular los costos de envío con las empresas de mensajería.
                </p>
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
                      <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                        <span>Envío: <span className="text-zinc-300">{pedido.metodo_envio || "estándar"}</span></span>
                        <span>Pago: <span className="text-zinc-300">{pedido.metodo_pago || "MercadoPago"}</span></span>
                        {pedido.proveedor_envio && (
                          <span>Mensajería: <span className="text-green-400 font-medium">{pedido.proveedor_envio}</span></span>
                        )}
                        {pedido.costo_envio && (
                          <span>Costo envío: <span className="text-zinc-300">${pedido.costo_envio.toLocaleString()}</span></span>
                        )}
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