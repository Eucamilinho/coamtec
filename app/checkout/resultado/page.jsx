"use client"

import { useEffect, Suspense } from "react"
import { useCarrito } from "../../store/carritoStore"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight, 
  ShoppingBag,
  Home,
  Mail,
  MessageCircle,
  Package,
  Truck
} from "lucide-react"

function ResultadoContenido() {
  const { vaciarCarrito } = useCarrito()
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  const paymentId = searchParams.get("payment_id")
  const preferenceId = searchParams.get("preference_id")
  const externalReference = searchParams.get("external_reference")

  useEffect(() => {
    // Solo vaciar el carrito si el pago fue aprobado y hay preferenceId
    if (preferenceId && (status === "approved" || status === "success")) {
      vaciarCarrito()
    }
  }, [status, preferenceId])

  useEffect(() => {
    console.log("Params:", {
      status,
      paymentId,
      preferenceId,
      externalReference,
      fullUrl: window.location.href
    })
  }, [])

  // Configuración de estados
  const estados = {
    success: {
      icon: <CheckCircle size={48} strokeWidth={1.5} />,
      titulo: "¡Pago confirmado!",
      mensaje: "Tu pedido ha sido procesado exitosamente.",
      descripcion: "Recibirás un correo con los detalles de tu compra y el seguimiento del envío.",
      color: "text-green-500",
      bgIcon: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    approved: {
      icon: <CheckCircle size={48} strokeWidth={1.5} />,
      titulo: "¡Pago aprobado!",
      mensaje: "Tu pedido ha sido procesado exitosamente.",
      descripcion: "Recibirás un correo con los detalles de tu compra y el seguimiento del envío.",
      color: "text-green-500",
      bgIcon: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    contraentrega: {
      icon: <Package size={48} strokeWidth={1.5} />,
      titulo: "¡Pedido confirmado!",
      mensaje: "Tu pedido de contraentrega ha sido registrado.",
      descripcion: "El courier te contactará para coordinar la entrega y el pago.",
      color: "text-blue-500",
      bgIcon: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    failure: {
      icon: <XCircle size={48} strokeWidth={1.5} />,
      titulo: "Pago rechazado",
      mensaje: "No se pudo procesar tu pago.",
      descripcion: "Verifica los datos de tu tarjeta o intenta con otro método de pago.",
      color: "text-red-500",
      bgIcon: "bg-red-100 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
    },
    pending: {
      icon: <Clock size={48} strokeWidth={1.5} />,
      titulo: "Pago en revisión",
      mensaje: "Tu pago está siendo procesado.",
      descripcion: "Te notificaremos por correo cuando se confirme el estado de tu pago.",
      color: "text-amber-500",
      bgIcon: "bg-amber-100 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
  }

  const actual = estados[status] || estados.pending
  const esExitoso = ["success", "approved", "contraentrega"].includes(status)

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-20 pb-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Card principal */}
        <div className={`bg-zinc-50 dark:bg-zinc-900 rounded-3xl border ${actual.borderColor} overflow-hidden`}>
          {/* Header con ícono */}
          <div className="pt-10 pb-6 px-6 text-center">
            <div className={`w-20 h-20 rounded-full ${actual.bgIcon} flex items-center justify-center mx-auto mb-6`}>
              <span className={actual.color}>{actual.icon}</span>
            </div>
            
            <h1 className={`text-2xl font-bold ${actual.color} mb-2`}>
              {actual.titulo}
            </h1>
            
            <p className="text-zinc-900 dark:text-white font-medium">
              {actual.mensaje}
            </p>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
              {actual.descripcion}
            </p>
          </div>

          {/* Información adicional si es exitoso */}
          {esExitoso && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Mail size={18} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      Confirmación por email
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Revisa tu bandeja de entrada
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Truck size={18} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      Seguimiento del envío
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Te avisaremos cuando salga tu pedido
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <MessageCircle size={18} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      Soporte por WhatsApp
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Estamos para ayudarte
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="px-6 pb-8 pt-2 space-y-3">
            <Link
              href="/productos"
              className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition active:scale-[0.98]"
            >
              <ShoppingBag size={18} />
              Seguir comprando
            </Link>
            
            <Link
              href="/"
              className="w-full h-12 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-medium rounded-2xl flex items-center justify-center gap-2 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-white transition"
            >
              <Home size={16} />
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Footer con info de contacto */}
        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            ¿Tienes dudas? Escríbenos al 
            <a 
              href="https://wa.me/573001234567" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 ml-1"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Resultado() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-zinc-300 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
          <p className="text-zinc-400 dark:text-zinc-500 text-sm">Cargando...</p>
        </div>
      </div>
    }>
      <ResultadoContenido />
    </Suspense>
  )
}
