import { create } from "zustand"
import { eliminarImagenStorage } from "../lib/supabase"

export const useProductos = create((set, get) => ({
  productos: [],
  cargando: false,

  cargarProductos: async () => {
    set({ cargando: true })
    try {
      const res = await fetch("/api/productos")
      const data = await res.json()
      if (res.ok) set({ productos: data })
      else console.error("Error cargando productos:", data.error)
    } catch (err) {
      console.error("Error cargando productos:", err)
    }
    set({ cargando: false })
  },

  agregarProducto: async (producto) => {
    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({ productos: [data, ...state.productos] }))
      } else {
        console.error("Error agregando producto:", data.error)
        alert("Error al agregar producto: " + data.error)
      }
    } catch (err) {
      console.error("Error agregando producto:", err)
      alert("Error al agregar producto")
    }
  },

  editarProducto: async (productoEditado) => {
    try {
      const res = await fetch("/api/productos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoEditado),
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          productos: state.productos.map((p) =>
            p.id === productoEditado.id ? { ...productoEditado, ...data } : p
          ),
        }))
      } else {
        console.error("Error editando producto:", data.error)
        alert("Error al editar producto: " + data.error)
      }
    } catch (err) {
      console.error("Error editando producto:", err)
      alert("Error al editar producto")
    }
  },

  eliminarProducto: async (id) => {
    // Primero obtenemos las imágenes del producto del state local
    const producto = get().productos.find((p) => p.id === id)

    // Eliminamos todas las imágenes del storage
    if (producto) {
      await eliminarImagenStorage(producto.imagen)
      if (producto.imagenes?.length > 0) {
        for (const img of producto.imagenes) {
          await eliminarImagenStorage(img)
        }
      }
    }

    try {
      const res = await fetch("/api/productos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id),
        }))
      } else {
        const data = await res.json()
        console.error("Error eliminando producto:", data.error)
        alert("Error al eliminar producto: " + data.error)
      }
    } catch (err) {
      console.error("Error eliminando producto:", err)
      alert("Error al eliminar producto")
    }
  },
}))