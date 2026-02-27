"use client"

import { useEffect, Suspense } from "react"
import { useCarrito } from "../../store/carritoStore"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react"

function ResultadoContenido() {
  const { vaciarCarrito } = useCarrito()
  const searchParams = useSearchParams()
  const status = searchParams.get("status")

  useEffect(() => {
    if (status === "success") {
      vaciarCarrito()
    }
  }, [status])

  const config = {
    success: {
      icon: <CheckCircle size={64} className="text-green-400" />,
      titulo: "¡Pago exitoso!",
      mensaje: "Tu pedido fue confirmado. Te enviaremos un email con los detalles.",
      color: "text-green-400",
    },
    failure: {
      icon: <XCircle size={64} className="text-red-400" />,
      titulo: "Pago rechazado",
      mensaje: "Hubo un problema con tu pago. Intenta de nuevo con otro método.",
      color: "text-red-400",
    },
    pending: {
      icon: <Clock size={64} className="text-yellow-400" />,
      titulo: "Pago pendiente",
      mensaje: "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
      color: "text-yellow-400",
    },
  }

  const actual = config[status] || config.pending

  return (
    <div className="max-w-md w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-6 text-center">
      {actual.icon}
      <div>
        <h1 className={`text-3xl font-black ${actual.color}`}>
          {actual.titulo}
        </h1>
        <p className="text-zinc-500 mt-2 leading-relaxed">
          {actual.mensaje}
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Link
          href="/productos"
          className="bg-green-400 text-black font-black py-4 rounded-xl hover:bg-green-300 transition flex items-center justify-center gap-2"
        >
          Seguir comprando
          <ArrowRight size={18} />
        </Link>
        <Link
          href="/"
          className="border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 py-3 rounded-xl hover:border-green-400 hover:text-green-400 transition text-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default function Resultado() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6 pt-20">
      <Suspense fallback={
        <div className="text-green-400 font-mono animate-pulse">Cargando...</div>
      }>
        <ResultadoContenido />
      </Suspense>
    </div>
  )
}