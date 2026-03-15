"use client"

import { useState, useEffect } from "react"
import { useCarrito } from "../store/carritoStore"
import { Plus, Check, Package, ShoppingBag } from "lucide-react"

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
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!stockInfo.puede) return

    agregarProducto(producto)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  // Sin stock
  if (!producto.stock || producto.stock <= 0) {
    return (
      <span className="inline-flex items-center justify-center gap-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 rounded-xl w-full">
        <Package size={14} />
        Agotado
      </span>
    )
  }

  // Máximo en carrito
  if (!stockInfo.puede) {
    return (
      <span className="inline-flex items-center justify-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-4 py-2.5 rounded-xl w-full">
        <ShoppingBag size={14} />
        {stockInfo.razon || "Stock máximo"}
      </span>
    )
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
          agregado
            ? "bg-green-500 text-white"
            : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98]"
        }`}
      >
        {agregado ? (
          <>
            <Check size={14} strokeWidth={2.5} />
            Agregado
          </>
        ) : (
          <>
            <Plus size={14} strokeWidth={2.5} />
            Añadir al carrito
          </>
        )}
      </button>
      
      {/* Stock info */}
      {(producto.stock <= 5 || cantidadEnCarrito > 0) && (
        <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500">
          {cantidadEnCarrito > 0 && (
            <span>{cantidadEnCarrito} en carrito • </span>
          )}
          <span className={stockDisponible <= 3 ? "text-amber-500 font-medium" : ""}>
            {stockDisponible} disponible{stockDisponible !== 1 ? 's' : ''}
          </span>
        </p>
      )}
    </div>
  )
}
