import { createClient } from "@supabase/supabase-js"
import { MercadoPagoConfig, Payment } from "mercadopago"

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(request) {
  // MercadoPago hace verificaciones GET del webhook
  console.log("Webhook GET verificación desde:", request.url)
  return new Response("OK", { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache'
    }
  })
}

export async function OPTIONS(request) {
  // Manejo de preflight CORS
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache'
    }
  })
}

export async function POST(request) {
  try {
    const body = await request.json()
    console.log("Webhook POST recibido desde:", request.url)
    console.log("Headers recibidos:", Object.fromEntries(request.headers.entries()))
    console.log("Webhook body:", JSON.stringify(body, null, 2))

    // Responder inmediatamente a MercadoPago para evitar reintentos
    const response = new Response("OK", { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

    // Manejar notificaciones de prueba
    if (body.live_mode === false && body.data?.id === "123456") {
      console.log("Notificación de prueba recibida correctamente")
      return response
    }

    // Procesar solo notificaciones de tipo payment
    if (body.type === "payment" && body.data?.id) {
      const paymentId = body.data.id
      console.log("Procesando Payment ID:", paymentId)

      try {
        const payment = new Payment(mp)
        const paymentInfo = await payment.get({ id: paymentId })
        
        console.log("Payment Info:", {
          id: paymentInfo.id,
          status: paymentInfo.status,
          preference_id: paymentInfo.preference_id,
          external_reference: paymentInfo.external_reference
        })

        const estado =
          paymentInfo.status === "approved" ? "pagado" :
          paymentInfo.status === "rejected" ? "rechazado" :
          paymentInfo.status === "cancelled" ? "cancelado" :
          "pendiente"

        // Actualizar pedido en Supabase usando preference_id o external_reference
        const { data, error } = await supabase
          .from("pedidos")
          .update({
            mp_payment_id: paymentInfo.id,
            mp_status: paymentInfo.status,
            estado,
            fecha_pagado: paymentInfo.status === "approved" ? new Date().toISOString() : null
          })
          .or(`mp_payment_id.eq.${paymentInfo.preference_id},external_reference.eq.${paymentInfo.external_reference}`)
          .select()

        if (error) {
          console.error("Error actualizando Supabase:", error)
        } else if (data && data.length > 0) {
          console.log("Pedido actualizado correctamente:", data[0].id)
        } else {
          console.log("No se encontró pedido para actualizar")
        }

      } catch (paymentError) {
        console.error("Error obteniendo info de pago:", paymentError)
      }
    }

    return response
  } catch (error) {
    console.error("Webhook error general:", error)
    // Siempre devolver 200 para evitar reintentos de MercadoPago
    return new Response("ERROR", { status: 200 })
  }
}