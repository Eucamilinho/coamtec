"use client"

import { useState, useEffect } from "react"
import { useCarrito } from "../store/carritoStore"
import { ShoppingCart, AlertTriangle, Package } from "lucide-react"

export default function BotonCarrito({ producto }) {
  const { agregarProducto, puedeAgregarProducto, items } = useCarrito()
  const [agregado, setAgregado] = useState(false)
  const [stockInfo, setStockInfo] = useState({ puede: true, razon: null })

  // Obtener cantidad actual en carrito
  const enCarrito = items.find(item => item.id === producto.id)
  const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0
  const stockDisponible = (producto.stock || 0) - cantidadEnCarrito

  useEffect(() => {
    const info = puedeAgregarProducto(producto)
    setStockInfo(info)
  }, [producto, items])

  const handleClick = (e) => {
    // avoid triggering parent link
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Validar stock antes de agregar
    if (!stockInfo.puede) {
      return
    }

    agregarProducto(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  // Si no hay stock
  if (!producto.stock || producto.stock <= 0) {
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
      >
        <Package size={14} />
        Sin stock
      </button>
    )
  }

  // Si ya tiene el máximo en carrito
  if (!stockInfo.puede) {
    return (
      <button
        disabled
        className="w-full py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 cursor-not-allowed border border-orange-200 dark:border-orange-800"
        title={stockInfo.razon}
      >
        <AlertTriangle size={14} />
        {stockInfo.razon}
      </button>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition transform duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
          agregado
            ? "bg-green-600 text-white scale-95 shadow-none"
            : "bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-md"
        }`}
      >
        <ShoppingCart size={14} />
        {agregado ? "¡Agregado!" : "Añadir al carrito"}
      </button>
      
      {/* Mostrar stock disponible si es bajo o si hay cantidad en carrito */}
      {(producto.stock <= 5 || cantidadEnCarrito > 0) && (
        <div className="text-xs text-center">
          {cantidadEnCarrito > 0 && (
            <span className="text-blue-600 dark:text-blue-400">
              {cantidadEnCarrito} en carrito • 
            </span>
          )}
          <span className={`${
            stockDisponible <= 3 
              ? 'text-orange-600 dark:text-orange-400 font-medium' 
              : 'text-zinc-500 dark:text-zinc-400'
          }`}>
            {stockDisponible} disponible{stockDisponible !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}