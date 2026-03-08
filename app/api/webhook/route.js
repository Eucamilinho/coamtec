import { createClient } from "@supabase/supabase-js"
import { MercadoPagoConfig, Payment } from "mercadopago"

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

        // Llamar a /api/actualizar-pedido para centralizar la lógica
        const url = `${process.env.NEXT_PUBLIC_URL || "https://www.coamtec.com"}/api/actualizar-pedido`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preferenceId: paymentInfo.external_reference,
            status: paymentInfo.status
          })
        });
        const result = await res.json();
        if (!res.ok) {
          console.error("Error en actualizar-pedido:", result);
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