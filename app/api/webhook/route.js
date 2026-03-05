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
  return Response.json({ status: "ok" })
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

    // Manejar notificaciones de prueba
    if (body.live_mode === false && body.data?.id === "123456") {
      return Response.json({ status: "ok" })
    }

    // Procesar solo notificaciones de tipo payment
    if (body.type === "payment" && body.data?.id) {
      const paymentId = body.data.id

      try {
        const payment = new Payment(mp)
        const paymentInfo = await payment.get({ id: paymentId })

        const estado =
          paymentInfo.status === "approved" ? "pagado" :
          paymentInfo.status === "rejected" ? "rechazado" :
          paymentInfo.status === "cancelled" ? "cancelado" :
          "pendiente"

        // Actualizar pedido en Supabase
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
        } else if (data && data.length > 0 && paymentInfo.status === "approved") {
          // Si el pago fue aprobado, actualizar stock
          const pedido = data[0]
          if (pedido.items && Array.isArray(pedido.items)) {
            console.log(`Actualizando stock para pedido pagado: ${pedido.id}`)
            
            for (const item of pedido.items) {
              try {
                // Obtener stock actual del producto
                const { data: producto, error: prodError } = await supabase
                  .from("productos")
                  .select("stock, nombre")
                  .eq("id", item.id)
                  .single()

                if (prodError) {
                  console.error(`Error obteniendo producto ${item.id}:`, prodError)
                  continue
                }

                if (producto) {
                  const nuevoStock = Math.max(0, producto.stock - item.cantidad)
                  const { error: updateError } = await supabase
                    .from("productos")
                    .update({ stock: nuevoStock })
                    .eq("id", item.id)
                  
                  if (updateError) {
                    console.error(`Error actualizando stock del producto ${item.id}:`, updateError)
                  } else {
                    console.log(`✅ Stock actualizado: ${producto.nombre} - ${producto.stock} → ${nuevoStock}`)
                  }
                }
              } catch (stockError) {
                console.error(`Error procesando stock del producto ${item.id}:`, stockError)
              }
            }
          }
        }

      } catch (paymentError) {
        console.error("Payment error:", paymentError)
      }
    }

    return Response.json({ status: "ok" })
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json({ status: "error", message: error.message }, { status: 200 })
  }
}