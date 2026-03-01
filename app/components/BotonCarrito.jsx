"use client"

import { useState } from "react"
import { useCarrito } from "../store/carritoStore"
import { ShoppingCart } from "lucide-react"

export default function BotonCarrito({ producto }) {
  const agregarProducto = useCarrito((state) => state.agregarProducto)
  const [agregado, setAgregado] = useState(false)

  const handleClick = (e) => {
    // avoid triggering parent link
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    agregarProducto(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-2.5 rounded-xl text-sm font-bold transition transform duration-300 flex items-center justify-center gap-2 shadow-sm ${
  agregado
    ? "bg-green-600 text-white scale-95 shadow-none"
    : "bg-green-400 text-black hover:bg-green-300 hover:scale-105 hover:shadow-md"
}`}
    >
      <ShoppingCart size={14} />
      {agregado ? "¡Agregado!" : "Añadir al carrito"}
    </button>
  )
}