import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCompraRapida = create(
  persist(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }),
      limpiar: () => set({ items: [] }),
    }),
    { name: "compra-rapida" }
  )
)