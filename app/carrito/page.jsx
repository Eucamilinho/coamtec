"use client";

import { useCarrito } from "../store/carritoStore";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  Lock,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Carrito() {
  const { items, eliminarProducto, vaciarCarrito } = useCarrito();

  const subtotal = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  const envio = subtotal > 0 ? 15000 : 0;
  const total = subtotal + envio;

  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center gap-6 pt-20">
        <div className="text-center">
          <ShoppingCart
            size={64}
            className="text-zinc-300 dark:text-zinc-700 mx-auto mb-4"
          />
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-zinc-500 mb-6">Agrega productos para continuar</p>
          <Link
            href="/productos"
            className="bg-green-400 text-black font-bold px-8 py-3 rounded-lg hover:bg-green-300 transition"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white px-6 pt-24 pb-12">
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
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-4 items-center hover:border-zinc-300 dark:hover:border-zinc-700 transition"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-green-400 text-xs font-mono">
                    {item.categoria}
                  </span>
                  <h2 className="text-zinc-800 dark:text-white font-semibold truncate">
                    {item.nombre}
                  </h2>
                  <p className="text-green-400 font-bold">
                    ${item.precio.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2">
                  <CantidadControl item={item} />
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-zinc-800 dark:text-white font-bold">
                    ${(item.precio * item.cantidad).toLocaleString()}
                  </p>
                  <button
                    onClick={() => eliminarProducto(item.id)}
                    className="text-zinc-400 hover:text-red-400 transition mt-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={vaciarCarrito}
              className="text-zinc-400 hover:text-red-400 text-sm transition self-start flex items-center gap-2"
            >
              <Trash2 size={14} />
              Vaciar carrito
            </button>
          </div>

          {/* Resumen */}
          <div className="flex flex-col gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col gap-4 sticky top-24">
              <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                Resumen del pedido
              </h2>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>
                    Subtotal ({items.reduce((acc, i) => acc + i.cantidad, 0)}{" "}
                    productos)
                  </span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Envío estimado</span>
                  <span>${envio.toLocaleString()}</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 flex justify-between font-bold text-lg">
                  <span className="text-zinc-800 dark:text-white">Total</span>
                  <span className="text-green-400">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cupón */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    placeholder="Código de descuento"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400"
                  />
                </div>
                <button className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">
                  Aplicar
                </button>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="bg-green-400 text-black font-black py-4 rounded-xl hover:bg-green-300 transition text-lg"
              >
                Proceder al pago →
              </button>

              <Link
                href="/productos"
                className="text-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-sm transition flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} />
                Seguir comprando
              </Link>

              {/* Sellos */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col gap-2">
                {[
                  { icon: <Lock size={12} />, label: "Pago 100% seguro" },
                  { icon: <Truck size={12} />, label: "Envío a todo Colombia" },
                  {
                    icon: <RotateCcw size={12} />,
                    label: "Devoluciones en 30 días",
                  },
                ].map((item) => (
                  <p
                    key={item.label}
                    className="text-zinc-400 text-xs flex items-center gap-2"
                  >
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
  );
}

function CantidadControl({ item }) {
  const restarCantidad = () => {
    if (item.cantidad === 1) {
      useCarrito.getState().eliminarProducto(item.id);
    } else {
      useCarrito.setState((state) => ({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad - 1 } : i,
        ),
      }));
    }
  };

  const sumarCantidad = () => {
    useCarrito.setState((state) => ({
      items: state.items.map((i) =>
        i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i,
      ),
    }));
  };

  return (
    <>
      <button
        onClick={restarCantidad}
        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
      >
        <Minus size={14} />
      </button>
      <span className="text-zinc-900 dark:text-white font-bold w-6 text-center">
        {item.cantidad}
      </span>
      <button
        onClick={sumarCantidad}
        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
      >
        <Plus size={14} />
      </button>
    </>
  );
}
