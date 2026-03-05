import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCompraRapida = create(
  persist(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }),
      actualizarCantidad: (id, cantidad) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, cantidad } : item
        )
      })),
      limpiar: () => set({ items: [] }),
    }),
    { name: "compra-rapida" }
  )
)