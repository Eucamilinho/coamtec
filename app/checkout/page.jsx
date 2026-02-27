"use client";

import { useState } from "react";
import { useCarrito } from "../store/carritoStore";
import Link from "next/link";
import {
  ChevronRight,
  Lock,
  Truck,
  Shield,
  CreditCard,
  Building2,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation"

const PASOS = ["Contacto", "Envío", "Pago"];

export default function Checkout() {
  const { items, vaciarCarrito } = useCarrito();
  const [paso, setPaso] = useState(0);
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    referencia: "",
    metodoPago: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const subtotal = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  const envio = 15000;
  const total = subtotal + envio;

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSiguiente = () => {
    if (paso < PASOS.length - 1) setPaso(paso + 1);
  };

  const handleAnterior = () => {
    if (paso > 0) setPaso(paso - 1);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white mb-4">
            Tu carrito está vacío
          </h1>
          <Link href="/productos" className="text-green-400 hover:underline">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-10">
          Finalizar <span className="text-green-400">pedido</span>
        </h1>

        {/* Pasos */}
        <div className="flex items-center gap-2 mb-10">
          {PASOS.map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition ${
                  i === paso
                    ? "bg-green-400 text-black"
                    : i < paso
                      ? "bg-green-400/20 text-green-400"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                    i === paso
                      ? "bg-black/20"
                      : i < paso
                        ? "bg-green-400 text-black"
                        : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500"
                  }`}
                >
                  {i < paso ? "✓" : i + 1}
                </span>
                {p}
              </div>
              {i < PASOS.length - 1 && (
                <ChevronRight
                  size={16}
                  className="text-zinc-300 dark:text-zinc-700"
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            {/* Paso 1 - Contacto */}
            {paso === 0 && (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold">Información de contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-500 text-sm">
                      Nombre completo
                    </label>
                    <input
                      name="nombre"
                      value={formulario.nombre}
                      onChange={handleChange}
                      placeholder="Juan Pérez"
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-500 text-sm">Email</label>
                    <input
                      name="email"
                      value={formulario.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="juan@email.com"
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-zinc-500 text-sm">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      name="telefono"
                      value={formulario.telefono}
                      onChange={handleChange}
                      placeholder="3001234567"
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2 - Envío */}
            {paso === 1 && (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold">Dirección de envío</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-500 text-sm">
                      Departamento
                    </label>
                    <input
                      name="departamento"
                      value={formulario.departamento}
                      onChange={handleChange}
                      placeholder="Santander"
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-500 text-sm">Ciudad</label>
                    <input
                      name="ciudad"
                      value={formulario.ciudad}
                      onChange={handleChange}
                      placeholder="Bucaramanga"
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-zinc-500 text-sm">Dirección</label>
                    <input
                      name="direccion"
                      value={formulario.direccion}
                      onChange={handleChange}
                      placeholder="Calle 45 # 32 - 15"
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-zinc-500 text-sm">
                      Referencia o indicaciones
                    </label>
                    <textarea
                      name="referencia"
                      value={formulario.referencia}
                      onChange={handleChange}
                      placeholder="Apto 301, edificio azul, cerca al parque..."
                      rows={3}
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 transition resize-none"
                    />
                  </div>
                </div>

                {/* Opciones de envío */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-zinc-500 text-sm font-medium">
                    Método de envío
                  </label>
                  {[
                    {
                      id: "estandar",
                      label: "Envío estándar",
                      desc: "3 a 5 días hábiles",
                      precio: 15000,
                    },
                    {
                      id: "express",
                      label: "Envío express",
                      desc: "1 a 2 días hábiles",
                      precio: 25000,
                    },
                  ].map((opcion) => (
                    <label
                      key={opcion.id}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                        formulario.envio === opcion.id
                          ? "border-green-400 bg-green-400/5"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-green-400/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="envio"
                          value={opcion.id}
                          onChange={handleChange}
                          className="accent-green-400"
                        />
                        <div>
                          <p className="text-zinc-800 dark:text-white font-medium text-sm">
                            {opcion.label}
                          </p>
                          <p className="text-zinc-500 text-xs">{opcion.desc}</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold text-sm">
                        ${opcion.precio.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 3 - Pago */}
            {paso === 2 && (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold">Método de pago</h2>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      id: "tarjeta",
                      icon: <CreditCard size={20} />,
                      label: "Tarjeta débito / crédito",
                      desc: "Visa, Mastercard, Amex",
                    },
                    {
                      id: "pse",
                      icon: <Building2 size={20} />,
                      label: "PSE",
                      desc: "Débito desde tu banco",
                    },
                    {
                      id: "contraentrega",
                      icon: <Wallet size={20} />,
                      label: "Contra entrega",
                      desc: "Paga cuando recibas",
                    },
                  ].map((metodo) => (
                    <label
                      key={metodo.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                        formulario.metodoPago === metodo.id
                          ? "border-green-400 bg-green-400/5"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-green-400/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="metodoPago"
                        value={metodo.id}
                        onChange={handleChange}
                        className="accent-green-400"
                      />
                      <div className="text-green-400">{metodo.icon}</div>
                      <div>
                        <p className="text-zinc-800 dark:text-white font-medium text-sm">
                          {metodo.label}
                        </p>
                        <p className="text-zinc-500 text-xs">{metodo.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Resumen final */}
                <div className="bg-green-400/5 border border-green-400/20 rounded-xl p-4 flex flex-col gap-2 mt-2">
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                    Resumen del pedido
                  </p>
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Envío</span>
                    <span>${envio.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-black text-lg border-t border-green-400/20 pt-2">
                    <span className="text-zinc-800 dark:text-white">Total</span>
                    <span className="text-green-400">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botones navegación */}
            <div className="flex justify-between mt-6">
              {paso > 0 ? (
                <button
                  onClick={handleAnterior}
                  className="border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 px-6 py-3 rounded-xl hover:border-zinc-400 transition font-medium"
                >
                  ← Anterior
                </button>
              ) : (
                <Link
                  href="/carrito"
                  className="border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 px-6 py-3 rounded-xl hover:border-zinc-400 transition font-medium"
                >
                  ← Volver al carrito
                </Link>
              )}
              {paso < PASOS.length - 1 ? (
                <button
                  onClick={handleSiguiente}
                  className="bg-green-400 text-black font-black px-8 py-3 rounded-xl hover:bg-green-300 transition"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={async () => {
                    setCargando(true);
                    setError("");
                    try {
                      const res = await fetch("/api/crear-preferencia", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          items,
                          formulario,
                          subtotal,
                          envio,
                          total,
                        }),
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        setError(
                          "Error al procesar el pago. Intenta de nuevo.",
                        );
                      }
                    } catch (err) {
                      setError("Error de conexión. Intenta de nuevo.");
                    }
                    setCargando(false);
                  }}
                  disabled={cargando || !formulario.metodoPago}
                  className="bg-green-400 text-black font-black px-8 py-3 rounded-xl hover:bg-green-300 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock size={16} />
                  {cargando ? "Procesando..." : "Confirmar pedido"}
                </button>
              )}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Resumen lateral */}
          <div>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sticky top-24 flex flex-col gap-4">
              <h3 className="font-bold text-zinc-800 dark:text-white">
                Tu pedido
              </h3>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="absolute -top-1 -right-1 bg-green-400 text-black text-xs font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {item.cantidad}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-800 dark:text-white text-sm font-medium truncate">
                        {item.nombre}
                      </p>
                    </div>
                    <p className="text-green-400 font-bold text-sm flex-shrink-0">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Envío</span>
                  <span>${envio.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-lg">
                  <span className="text-zinc-800 dark:text-white">Total</span>
                  <span className="text-green-400">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {[
                  { icon: <Lock size={12} />, label: "Pago 100% seguro" },
                  { icon: <Truck size={12} />, label: "Envío a todo Colombia" },
                  {
                    icon: <Shield size={12} />,
                    label: "Garantía en todos los productos",
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
