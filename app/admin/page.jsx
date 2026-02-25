"use client"

import { useState, useEffect } from "react"
import { useProductos } from "../store/productosStore"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

const productoVacio = {
  nombre: "",
  precio: "",
  descuento: 0,
  descripcion: "",
  imagen: "https://placehold.co/300x200",
  categoria: "",
  stock: "",
}

export default function Admin() {
  const { productos, cargarProductos, agregarProducto, editarProducto, eliminarProducto } = useProductos()
  const [formulario, setFormulario] = useState(productoVacio)
  const [editando, setEditando] = useState(null)
  const [verificando, setVerificando] = useState(true)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [preview, setPreview] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
      } else {
        setVerificando(false)
        cargarProductos()
      }
    }
    verificarSesion()
  }, [])

  if (verificando) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-green-400 font-mono animate-pulse">Verificando sesión...</p>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const handleImagen = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    setSubiendoImagen(true)
    setPreview(URL.createObjectURL(archivo))

    const extension = archivo.name.split(".").pop()
    const nombreArchivo = `${Date.now()}.${extension}`

    const { error } = await supabase.storage
      .from("productos")
      .upload(nombreArchivo, archivo)

    if (error) {
      console.error("Error subiendo imagen:", error)
      setSubiendoImagen(false)
      return
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(nombreArchivo)

    setFormulario({ ...formulario, imagen: data.publicUrl })
    setSubiendoImagen(false)
  }

  const handleSubmit = async () => {
    if (!formulario.nombre || !formulario.precio) return

    if (editando) {
      await editarProducto({ ...formulario, id: editando })
      setEditando(null)
    } else {
      await agregarProducto(formulario)
    }
    setFormulario(productoVacio)
    setPreview(null)
  }

  const handleEditar = (producto) => {
    setFormulario(producto)
    setPreview(producto.imagen)
    setEditando(producto.id)
  }

  const handleCancelar = () => {
    setFormulario(productoVacio)
    setPreview(null)
    setEditando(null)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">
          Panel <span className="text-green-400">Admin</span>
        </h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/login")
          }}
          className="bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 px-4 py-2 rounded-lg text-sm transition"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Formulario */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          {editando ? "Editar producto" : "Agregar producto"}
        </h2>
        <div className="flex flex-col gap-3">

          {/* Subida de imagen */}
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 text-sm">Imagen del producto</label>
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-600 text-3xl">📷</span>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="bg-zinc-800 border border-zinc-700 hover:border-green-400 text-zinc-300 px-4 py-2 rounded-lg text-sm cursor-pointer transition text-center">
                  {subiendoImagen ? "Subiendo..." : "Seleccionar imagen"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagen}
                    className="hidden"
                    disabled={subiendoImagen}
                  />
                </label>
                <p className="text-zinc-600 text-xs">O pega una URL abajo</p>
                <input
                  name="imagen"
                  value={formulario.imagen}
                  onChange={handleChange}
                  placeholder="URL de la imagen"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 text-sm"
                />
              </div>
            </div>
          </div>

          <input
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="precio"
              value={formulario.precio}
              onChange={handleChange}
              placeholder="Precio"
              type="number"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500"
            />
            <input
              name="descuento"
              value={formulario.descuento}
              onChange={handleChange}
              placeholder="Descuento %"
              type="number"
              min="0"
              max="100"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="categoria"
              value={formulario.categoria}
              onChange={handleChange}
              placeholder="Categoría"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500"
            />
            <input
              name="stock"
              value={formulario.stock}
              onChange={handleChange}
              placeholder="Stock"
              type="number"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500"
            />
          </div>
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500"
            rows={3}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={subiendoImagen}
              className="bg-green-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-green-300 transition disabled:opacity-50"
            >
              {editando ? "Guardar cambios" : "Agregar producto"}
            </button>
            {editando && (
              <button
                onClick={handleCancelar}
                className="bg-zinc-700 text-white py-2 px-6 rounded-lg hover:bg-zinc-600 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="flex flex-col gap-4 max-w-2xl">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center gap-4"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-white truncate">{producto.nombre}</h2>
              <p className="text-sm text-zinc-500">{producto.categoria}</p>
              <p className="text-green-400 font-bold">
                ${Number(producto.precio).toLocaleString()}
              </p>
              <p className="text-sm text-zinc-500">Stock: {producto.stock}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => handleEditar(producto)}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition font-medium"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarProducto(producto.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}