"use client"

import { useCarrito } from "../store/carritoStore"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag, Lock, Truck, RotateCcw, AlertTriangle, Package } from "lucide-react"

export default function Carrito() {
  const { items, eliminarProducto, vaciarCarrito, actualizarCantidad, cantidadDisponible } = useCarrito()
  const router = useRouter()
  const [stockAlerts, setStockAlerts] = useState({})

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const envio = subtotal > 0 ? 15000 : 0
  const total = subtotal + envio
  
  // Validar si hay productos sin stock suficiente
  const hayProductosSinStock = items.some(item => !item.stock || item.cantidad > item.stock)
  const hayStockInsuficiente = items.some(item => item.stock && item.stock < item.cantidad)
  
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center gap-6 pt-20 px-6">
        <div className="text-center">
          <ShoppingCart size={64} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white mb-2">Tu carrito está vacío</h1>
          <p className="text-zinc-500 mb-6">Agrega productos para continuar</p>
          <Link href="/productos" className="bg-green-400 text-black font-bold px-8 py-3 rounded-lg hover:bg-green-300 transition">
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white px-4 md:px-6 pt-24 pb-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-black mb-8">
          Mi <span className="text-green-400">Carrito</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Lista productos */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition"
              >
                {/* Fila superior: imagen + info + eliminar */}
                <div className="flex gap-3 items-start">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-green-400 text-xs font-mono">{item.categoria}</span>
                    <h2 className="text-zinc-800 dark:text-white font-semibold text-sm md:text-base leading-tight">
                      {item.nombre}
                    </h2>
                    <p className="text-green-400 font-bold text-sm mt-0.5">
                      ${item.precio.toLocaleString()} c/u
                    </p>
                    
                    {/* Información de stock */}
                    <div className="flex items-center gap-2 mt-1">
                      <Package size={12} className="text-zinc-400" />
                      <span className={`text-xs ${
                        !item.stock || item.stock === 0 
                          ? 'text-red-500 font-semibold' 
                          : item.stock <= 3 
                          ? 'text-orange-500 font-medium'
                          : 'text-zinc-500'
                      }`}>
                        {!item.stock || item.stock === 0 
                          ? 'Sin stock'
                          : item.stock <= 3
                          ? `¡Solo ${item.stock} disponible${item.stock > 1 ? 's' : ''}!`
                          : `${item.stock} disponibles`
                        }
                      </span>
                    </div>
                    
                    {/* Alerta de stock */}
                    {stockAlerts[item.id] && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded px-2 py-1">
                        <AlertTriangle size={12} />
                        <span>{stockAlerts[item.id]}</span>
                      </div>
                    )}
                    
                    {/* Alerta si cantidad excede stock */}
                    {item.stock && item.cantidad > item.stock && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded px-2 py-1">
                        <AlertTriangle size={12} />
                        <span>Cantidad en carrito ({item.cantidad}) excede stock disponible ({item.stock})</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => eliminarProducto(item.id)}
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                    className="text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition flex-shrink-0 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center -mr-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Fila inferior: cantidad + subtotal */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2">
                    <CantidadControl item={item} mostrarAlertaStock={mostrarAlertaStock} />
                  </div>
                  <p className="text-zinc-800 dark:text-white font-bold text-base">
                    ${(item.precio * item.cantidad).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={vaciarCarrito}
              aria-label="Vaciar todo el carrito"
              className="text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 text-sm transition self-start flex items-center gap-2 py-2 px-3 -ml-3 min-h-[40px]"
            >
              <Trash2 size={16} />
              Vaciar carrito
            </button>
          </div>

          {/* Resumen */}
          <div>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 sticky top-24 flex flex-col gap-4 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-800 dark:text-white">Resumen</h2>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.cantidad, 0)} productos)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Envío estimado</span>
                  <span>${envio.toLocaleString()}</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-bold text-base">
                  <span className="text-zinc-800 dark:text-white">Total</span>
                  <span className="text-green-400">${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Cupón */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    placeholder="Código de descuento"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400"
                  />
                </div>
                <button className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-white px-3 py-2 rounded-lg text-sm hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">
                  Aplicar
                </button>
              </div>

              {/* Alertas de stock en resumen */}
              {hayProductosSinStock && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-700 dark:text-red-300">
                      <p className="font-semibold mb-1">Problemas de inventario detectados</p>
                      <p>Algunos productos no tienen suficiente stock. Revisa las cantidades antes de continuar.</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (hayProductosSinStock) {
                    // Mostrar alerta si hay problemas de stock
                    alert("No puedes proceder al checkout. Algunos productos no tienen suficiente stock disponible.");
                    return;
                  }
                  router.push("/checkout");
                }}
                disabled={hayProductosSinStock}
                className={`font-black py-4 rounded-xl transition text-base ${
                  hayProductosSinStock
                    ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
                    : 'bg-green-400 text-black hover:bg-green-300'
                }`}
              >
                {hayProductosSinStock ? (
                  <>
                    <AlertTriangle size={16} className="inline mr-2" />
                    Revisar inventario
                  </>
                ) : (
                  'Proceder al pago →'
                )}
              </button>

              <Link
                href="/productos"
                className="text-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-sm transition flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} />
                Seguir comprando
              </Link>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex flex-col gap-2">
                {[
                  { icon: <Lock size={12} />, label: "Pago 100% seguro" },
                  { icon: <Truck size={12} />, label: "Envío a todo Colombia" },
                  { icon: <RotateCcw size={12} />, label: "Devoluciones en 30 días" },
                ].map((item) => (
                  <p key={item.label} className="text-zinc-400 text-xs flex items-center gap-2">
                    <span className="text-green-400">{item.icon}</span>
                    {item.label}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CantidadControl({ item, mostrarAlertaStock }) {
  const { actualizarCantidad, eliminarProducto } = useCarrito()

  const restarCantidad = () => {
    if (item.cantidad === 1) {
      eliminarProducto(item.id)
    } else {
      actualizarCantidad(item.id, item.cantidad - 1)
    }
  }

  const sumarCantidad = () => {
    // Verificar stock antes de sumar
    if (!item.stock || item.cantidad >= item.stock) {
      mostrarAlertaStock(item.id, `Stock máximo alcanzado (${item.stock || 0} disponibles)`)
      return
    }
    
    actualizarCantidad(item.id, item.cantidad + 1)
  }

  const puedeAumentar = item.stock && item.cantidad < item.stock
  const tieneStock = item.stock && item.stock > 0

  return (
    <>
      <button 
        onClick={restarCantidad} 
        aria-label={`Reducir cantidad de ${item.nombre}`}
        className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition p-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
      >
        <Minus size={16} />
      </button>
      <span className="text-zinc-900 dark:text-white font-bold w-8 text-center text-sm" aria-live="polite">
        {item.cantidad}
      </span>
      <button 
        onClick={sumarCantidad} 
        disabled={!puedeAumentar}
        aria-label={`Aumentar cantidad de ${item.nombre}`}
        className={`p-2 min-w-[40px] min-h-[40px] flex items-center justify-center transition ${
          puedeAumentar
            ? 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            : 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
        }`}
        title={!puedeAumentar ? `Stock máximo: ${item.stock || 0}` : ''}
      >
        <Plus size={16} />
      </button>
    </>
  )
}