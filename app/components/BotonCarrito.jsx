"use client"

import { useCarrito } from "../store/carritoStore"

export default function BotonCarrito({ producto }) {
  const agregarProducto = useCarrito((state) => state.agregarProducto)

  return (
    <button
      onClick={() => agregarProducto(producto)}
      className="mt-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Agregar al carrito
    </button>
  )
}