import { create } from "zustand"
import { supabase, eliminarImagenStorage } from "../lib/supabase"

export const useProductos = create((set) => ({
  productos: [],
  cargando: false,

  cargarProductos: async () => {
    set({ cargando: true })
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) console.error("Error cargando productos:", error)
    else set({ productos: data })
    set({ cargando: false })
  },

  agregarProducto: async (producto) => {
    const { data, error } = await supabase
      .from("productos")
      .insert([producto])
      .select()
    if (error) console.error("Error agregando producto:", error)
    else set((state) => ({ productos: [data[0], ...state.productos] }))
  },

  editarProducto: async (productoEditado) => {
    const { id, ...resto } = productoEditado
    const { error } = await supabase
      .from("productos")
      .update(resto)
      .eq("id", id)
    if (error) console.error("Error editando producto:", error)
    else set((state) => ({
      productos: state.productos.map((p) => p.id === id ? productoEditado : p),
    }))
  },

  eliminarProducto: async (id) => {
    // Primero obtenemos las imágenes del producto
    const { data } = await supabase
      .from("productos")
      .select("imagen, imagenes")
      .eq("id", id)
      .single()

    // Eliminamos todas las imágenes del storage
    if (data) {
      await eliminarImagenStorage(data.imagen)
      if (data.imagenes?.length > 0) {
        for (const img of data.imagenes) {
          await eliminarImagenStorage(img)
        }
      }
    }

    const { error } = await supabase.from("productos").delete().eq("id", id)
    if (error) console.error("Error eliminando producto:", error)
    else set((state) => ({
      productos: state.productos.filter((p) => p.id !== id),
    }))
  },
}))