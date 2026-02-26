import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useWishlist = create(
  persist(
    (set) => ({
      items: [],

      toggleWishlist: (producto) =>
        set((state) => {
          const existe = state.items.find((p) => p.id === producto.id)
          if (existe) {
            return { items: state.items.filter((p) => p.id !== producto.id) }
          }
          // Guardamos solo los campos necesarios
          const productoLimpio = {
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            descuento: Number(producto.descuento) || 0,
            imagen: producto.imagen,
            categoria: producto.categoria,
            stock: producto.stock,
          }
          return { items: [...state.items, productoLimpio] }
        }),
    }),
    { name: "wishlist" }
  )
)