"use client"

import { useState } from "react"
import { useCarrito } from "../store/carritoStore"
import { ShoppingCart } from "lucide-react"

export default function BotonCarrito({ producto }) {
  const agregarProducto = useCarrito((state) => state.agregarProducto)
  const [agregado, setAgregado] = useState(false)

  const handleClick = () => {
    agregarProducto(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
  agregado
    ? "bg-green-600 text-white"
    : "bg-green-400 text-black hover:bg-green-300"
}`}
    >
      <ShoppingCart size={14} />
      {agregado ? "¡Agregado!" : "Añadir al carrito"}
    </button>
  )
}