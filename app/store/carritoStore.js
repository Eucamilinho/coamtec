import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCarrito = create(
  persist(
    (set, get) => ({
      items: [],

      agregarProducto: (producto) =>
        set((state) => {
          const existe = state.items.find((item) => item.id === producto.id)
          
          // Verificar stock disponible
          if (!producto.stock || producto.stock <= 0) {
            // No agregar si no hay stock
            return state;
          }
          
          if (existe) {
            // Si ya existe, verificar que no exceda el stock
            const nuevaCantidad = existe.cantidad + 1;
            if (nuevaCantidad > producto.stock) {
              // No agregar si excede el stock
              return state;
            }
            
            return {
              items: state.items.map((item) =>
                item.id === producto.id
                  ? { ...item, cantidad: nuevaCantidad, stock: producto.stock }
                  : item
              ),
            }
          }
          
          // Agregar nuevo producto con stock
          return { 
            items: [...state.items, { ...producto, cantidad: 1, stock: producto.stock }] 
          }
        }),

      actualizarCantidad: (id, cantidad) =>
        set((state) => {
          if (cantidad <= 0) {
            return {
              items: state.items.filter((item) => item.id !== id),
            }
          }
          
          return {
            items: state.items.map((item) => {
              if (item.id === id) {
                // No permitir cantidad mayor al stock
                const nuevaCantidad = Math.min(cantidad, item.stock || 0);
                return { ...item, cantidad: nuevaCantidad };
              }
              return item;
            }),
          }
        }),

      eliminarProducto: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      vaciarCarrito: () => set({ items: [] }),

      // Función para verificar si se puede agregar un producto
      puedeAgregarProducto: (producto) => {
        const state = get();
        const existe = state.items.find((item) => item.id === producto.id);
        
        if (!producto.stock || producto.stock <= 0) {
          return { puede: false, razon: "Sin stock" };
        }
        
        if (existe && existe.cantidad >= producto.stock) {
          return { puede: false, razon: "Stock máximo alcanzado" };
        }
        
        return { puede: true, razon: null };
      },

      // Función para obtener la cantidad disponible para agregar
      cantidadDisponible: (productoId) => {
        const state = get();
        const existe = state.items.find((item) => item.id === productoId);
        
        if (!existe) return null;
        return Math.max(0, existe.stock - existe.cantidad);
      }
    }),
    {
      name: "carrito", // nombre con el que se guarda en localStorage
    }
  )
)