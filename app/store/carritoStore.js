import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCarrito = create(
  persist(
    (set) => ({
      items: [],

      agregarProducto: (producto) =>
        set((state) => {
          const existe = state.items.find((item) => item.id === producto.id)
          if (existe) {
            return {
              items: state.items.map((item) =>
                item.id === producto.id
                  ? { ...item, cantidad: item.cantidad + 1 }
                  : item
              ),
            }
          }
          return { items: [...state.items, { ...producto, cantidad: 1 }] }
        }),

      eliminarProducto: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      vaciarCarrito: () => set({ items: [] }),
    }),
    {
      name: "carrito", // nombre con el que se guarda en localStorage
    }
  )
)