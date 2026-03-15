"use client"

import { useCarrito } from "../store/carritoStore"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Tag, 
  Lock, 
  Truck, 
  RotateCcw, 
  AlertTriangle, 
  Package,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  ShoppingBasket
} from "lucide-react"

export default function Carrito() {
  const { items, eliminarProducto, vaciarCarrito, actualizarCantidad, cantidadDisponible } = useCarrito()
  const router = useRouter()
  const [stockAlerts, setStockAlerts] = useState({})

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const envio = subtotal > 0 ? 15000 : 0
  const total = subtotal + envio
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)
  
  // Validar si hay productos sin stock suficiente
  const hayProductosSinStock = items.some(item => !item.stock || item.cantidad > item.stock)
  
  const mostrarAlertaStock = (productId, mensaje) => {
    setStockAlerts(prev => ({ ...prev, [productId]: mensaje }))
    setTimeout(() => {
      setStockAlerts(prev => {
        const newAlerts = { ...prev }
        delete newAlerts[productId]
        return newAlerts
      })
    }, 3000)
  }

  // Estado vacío - iOS style
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col pt-24">
        {/* Empty State */}
        <main className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="text-center max-w-sm">
            {/* Icono con estilo Apple */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <ShoppingBag size={32} className="text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Explora nuestros productos gaming y encuentra lo perfecto para ti
            </p>
            
            <Link 
              href="/productos" 
              className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium px-8 py-3.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-[0.98]"
            >
              Ver productos
              <ChevronRight size={18} />
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-8 pt-24">
      <main className="max-w-4xl mx-auto px-4">
        {/* Header de la página */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center">
              <ShoppingBasket size={20} className="text-white dark:text-zinc-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                Mi Carrito
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          
          <button
            onClick={vaciarCarrito}
            className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition font-medium flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Vaciar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista productos */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50"
              >
                <div className="p-4 sm:p-5">
                  {/* Layout flexible para imagen y contenido */}
                  <div className="flex gap-4">
                    {/* Imagen del producto */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-zinc-100 dark:bg-zinc-800"
                      />
                      {/* Badge de categoría */}
                      <span className="absolute -bottom-1 -right-1 text-[10px] font-medium bg-zinc-900 dark:bg-zinc-700 text-white px-1.5 py-0.5 rounded-full">
                        {item.categoria?.slice(0, 3).toUpperCase()}
                      </span>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-zinc-900 dark:text-white font-semibold text-sm sm:text-base leading-tight line-clamp-2">
                            {item.nombre}
                          </h2>
                          <button
                            onClick={() => eliminarProducto(item.id)}
                            aria-label={`Eliminar ${item.nombre} del carrito`}
                            className="flex-shrink-0 p-2 -m-2 text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        </div>
                        
                        <p className="text-zinc-900 dark:text-white font-bold text-lg mt-1">
                          ${item.precio.toLocaleString()}
                        </p>
                      </div>

                      {/* Stock info */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <Package size={14} className={`
                          ${!item.stock || item.stock === 0 
                            ? 'text-red-500' 
                            : item.stock <= 3 
                            ? 'text-orange-500'
                            : 'text-zinc-400 dark:text-zinc-500'}
                        `} />
                        <span className={`text-xs font-medium ${
                          !item.stock || item.stock === 0 
                            ? 'text-red-500' 
                            : item.stock <= 3 
                            ? 'text-orange-500'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }`}>
                          {!item.stock || item.stock === 0 
                            ? 'Sin stock'
                            : item.stock <= 3
                            ? `Solo ${item.stock} disponible${item.stock > 1 ? 's' : ''}`
                            : `${item.stock} disponibles`
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Alerta de stock */}
                  {(stockAlerts[item.id] || (item.stock && item.cantidad > item.stock)) && (
                    <div className="mt-4 flex items-center gap-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg px-3 py-2">
                      <AlertTriangle size={14} />
                      <span>{stockAlerts[item.id] || `Excede stock disponible (${item.stock})`}</span>
                    </div>
                  )}

                  {/* Controles de cantidad y subtotal */}
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    {/* iOS Style Quantity Control */}
                    <div className="flex items-center bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                      <button 
                        onClick={() => {
                          if (item.cantidad === 1) {
                            eliminarProducto(item.id)
                          } else {
                            actualizarCantidad(item.id, item.cantidad - 1)
                          }
                        }}
                        className="w-9 h-9 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition rounded-full"
                        aria-label="Reducir cantidad"
                      >
                        <Minus size={16} strokeWidth={2} />
                      </button>
                      
                      <span className="w-10 text-center font-semibold text-zinc-900 dark:text-white text-sm">
                        {item.cantidad}
                      </span>
                      
                      <button 
                        onClick={() => {
                          if (!item.stock || item.cantidad >= item.stock) {
                            mostrarAlertaStock(item.id, `Máximo ${item.stock || 0} disponibles`)
                            return
                          }
                          actualizarCantidad(item.id, item.cantidad + 1)
                        }}
                        disabled={!item.stock || item.cantidad >= item.stock}
                        className={`w-9 h-9 flex items-center justify-center rounded-full transition ${
                          item.stock && item.cantidad < item.stock
                            ? 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                            : 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                        }`}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={16} strokeWidth={2} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Subtotal</span>
                      <p className="text-zinc-900 dark:text-white font-bold">
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen - iOS Card Style */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sticky top-24">
              {/* Header del resumen */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Sparkles size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Resumen
                </h2>
              </div>

              {/* Desglose */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </span>
                  <span className="text-zinc-900 dark:text-white font-medium">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Envío estimado
                  </span>
                  <span className="text-zinc-900 dark:text-white font-medium">
                    ${envio.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cupón - iOS Style */}
              <div className="mb-5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      placeholder="Código promocional"
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
                    />
                  </div>
                  <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium px-4 py-2.5 rounded-xl text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition active:scale-[0.98]">
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-900 dark:text-white font-semibold">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                      ${total.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 block">
                      COP
                    </span>
                  </div>
                </div>
              </div>

              {/* Alertas de stock */}
              {hayProductosSinStock && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-3 mb-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-600 dark:text-red-300">
                      <p className="font-semibold">Productos sin stock</p>
                      <p className="text-red-500 dark:text-red-400 mt-0.5">Ajusta las cantidades para continuar</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de checkout - Apple Style */}
              <button
                onClick={() => {
                  if (hayProductosSinStock) {
                    alert("Algunos productos no tienen suficiente stock disponible.")
                    return
                  }
                  router.push("/checkout")
                }}
                disabled={hayProductosSinStock}
                className={`w-full font-semibold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                  hayProductosSinStock
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                }`}
              >
                {hayProductosSinStock ? (
                  <>
                    <AlertTriangle size={16} />
                    Revisar inventario
                  </>
                ) : (
                  <>
                    Proceder al pago
                    <ChevronRight size={18} />
                  </>
                )}
              </button>

              {/* Link seguir comprando */}
              <Link
                href="/productos"
                className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} />
                Seguir comprando
              </Link>

              {/* Beneficios */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 mt-5 pt-4 space-y-2.5">
                {[
                  { icon: <Lock size={14} />, label: "Pago 100% seguro" },
                  { icon: <Truck size={14} />, label: "Envío a todo Colombia" },
                  { icon: <RotateCcw size={14} />, label: "Devoluciones en 30 días" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="text-zinc-400 dark:text-zinc-500">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
