import { create } from "zustand"
import { supabase } from "../lib/supabase"

export const useProductos = create((set) => ({
  productos: [],
  cargando: false,

  cargarProductos: async () => {
    set({ cargando: true })
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error cargando productos:", error)
    } else {
      set({ productos: data })
    }
    set({ cargando: false })
  },

  agregarProducto: async (producto) => {
    const { data, error } = await supabase
      .from("productos")
      .insert([producto])
      .select()

    if (error) {
      console.error("Error agregando producto:", error)
    } else {
      set((state) => ({ productos: [data[0], ...state.productos] }))
    }
  },

  editarProducto: async (productoEditado) => {
    const { id, ...resto } = productoEditado
    const { error } = await supabase
      .from("productos")
      .update(resto)
      .eq("id", id)

    if (error) {
      console.error("Error editando producto:", error)
    } else {
      set((state) => ({
        productos: state.productos.map((p) =>
          p.id === id ? productoEditado : p
        ),
      }))
    }
  },

  eliminarProducto: async (id) => {
    const { error } = await supabase
      .from("productos")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error eliminando producto:", error)
    } else {
      set((state) => ({
        productos: state.productos.filter((p) => p.id !== id),
      }))
    }
  },
}))