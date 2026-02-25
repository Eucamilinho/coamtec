"use client"

import { useCarrito } from "../store/carritoStore"
import Link from "next/link"

export default function Carrito() {
  const { items, eliminarProducto, vaciarCarrito } = useCarrito()

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const envio = subtotal > 0 ? 15000 : 0
  const total = subtotal + envio

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h1 className="text-3xl font-black text-white mb-2">Tu carrito está vacío</h1>
          <p className="text-zinc-500 mb-6">Agrega productos para continuar</p>
          <Link
            href="/productos"
            className="bg-green-400 text-black font-bold px-8 py-3 rounded-lg hover:bg-green-300 transition"
          >
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-black mb-10">
          Mi <span className="text-green-400">Carrito</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Lista de productos */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 items-center hover:border-zinc-700 transition"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-green-400 text-xs font-mono">{item.categoria}</span>
                  <h2 className="text-white font-semibold truncate">{item.nombre}</h2>
                  <p className="text-green-400 font-bold">
                    ${item.precio.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
                  <CantidadControl item={item} />
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-bold">
                    ${(item.precio * item.cantidad).toLocaleString()}
                  </p>
                  <button
                    onClick={() => eliminarProducto(item.id)}
                    className="text-zinc-600 hover:text-red-400 text-xs mt-1 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={vaciarCarrito}
              className="text-zinc-600 hover:text-red-400 text-sm transition self-start"
            >
              🗑️ Vaciar carrito
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className="flex flex-col gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4 sticky top-24">
              <h2 className="text-xl font-bold">Resumen del pedido</h2>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.cantidad, 0)} productos)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Envío estimado</span>
                  <span>${envio.toLocaleString()}</span>
                </div>
                <div className="border-t border-zinc-800 pt-2 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-400">${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Cupón */}
              <div className="flex gap-2">
                <input
                  placeholder="Código de descuento"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                />
                <button className="bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-600 transition">
                  Aplicar
                </button>
              </div>

              <button className="bg-green-400 text-black font-black py-4 rounded-xl hover:bg-green-300 transition text-lg">
                Proceder al pago →
              </button>

              <Link
                href="/productos"
                className="text-center text-zinc-500 hover:text-zinc-300 text-sm transition"
              >
                ← Seguir comprando
              </Link>

              {/* Sellos */}
              <div className="border-t border-zinc-800 pt-4 flex flex-col gap-2">
                {[
                  "🔒 Pago 100% seguro",
                  "🚚 Envío a todo Colombia",
                  "🔄 Devoluciones en 30 días",
                ].map((item) => (
                  <p key={item} className="text-zinc-500 text-xs">{item}</p>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function CantidadControl({ item }) {
  const { items, agregarProducto, eliminarProducto } = useCarrito()

  const restarCantidad = () => {
    if (item.cantidad === 1) {
      eliminarProducto(item.id)
    } else {
      useCarrito.setState((state) => ({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad - 1 } : i
        ),
      }))
    }
  }

  const sumarCantidad = () => {
    useCarrito.setState((state) => ({
      items: state.items.map((i) =>
        i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
      ),
    }))
  }

  return (
    <>
      <button
        onClick={restarCantidad}
        className="text-zinc-400 hover:text-white transition font-bold text-lg w-6 text-center"
      >
        −
      </button>
      <span className="text-white font-bold w-6 text-center">{item.cantidad}</span>
      <button
        onClick={sumarCantidad}
        className="text-zinc-400 hover:text-white transition font-bold text-lg w-6 text-center"
      >
        +
      </button>
    </>
  )
}