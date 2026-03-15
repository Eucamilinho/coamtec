import { create } from "zustand"
import { supabase, eliminarImagenStorage } from "../lib/supabase"

// Helper para obtener headers con token de autenticación
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = { "Content-Type": "application/json" }
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`
  }
  return headers
}

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
      const headers = await getAuthHeaders()
      const res = await fetch("/api/productos", {
        method: "POST",
        headers,
        body: JSON.stringify(producto),
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({ productos: [data, ...state.productos] }))
        return true
      } else {
        console.error("Error agregando producto:", data.error)
        alert("Error al agregar producto: " + data.error)
        return false
      }
    } catch (err) {
      console.error("Error agregando producto:", err)
      alert("Error al agregar producto")
      return false
    }
  },

  editarProducto: async (productoEditado) => {
    try {
      const headers = await getAuthHeaders()
      const res = await fetch("/api/productos", {
        method: "PUT",
        headers,
        body: JSON.stringify(productoEditado),
      })
      const data = await res.json()
      if (res.ok) {
        set((state) => ({
          productos: state.productos.map((p) =>
            p.id === productoEditado.id ? { ...productoEditado, ...data } : p
          ),
        }))
        return true
      } else {
        console.error("Error editando producto:", data.error)
        alert("Error al editar producto: " + data.error)
        return false
      }
    } catch (err) {
      console.error("Error editando producto:", err)
      alert("Error al editar producto")
      return false
    }
  },

  eliminarProducto: async (id) => {
    const producto = get().productos.find((p) => p.id === id)

    if (producto) {
      await eliminarImagenStorage(producto.imagen)
      if (producto.imagenes?.length > 0) {
        for (const img of producto.imagenes) {
          await eliminarImagenStorage(img)
        }
      }
    }

    try {
      const headers = await getAuthHeaders()
      const res = await fetch("/api/productos", {
        method: "DELETE",
        headers,
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