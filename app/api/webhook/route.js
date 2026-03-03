import { createClient } from "@supabase/supabase-js"
import { MercadoPagoConfig, Payment } from "mercadopago"

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    console.log("Webhook recibido:", JSON.stringify(body))

    // Ignorar notificaciones de prueba
    if (body.live_mode === false && body.data?.id === "123456") {
      return Response.json({ ok: true })
    }

    if (body.type === "payment") {
      const paymentId = body.data.id
      console.log("Payment ID:", paymentId)

      const payment = new Payment(mp)
      const paymentInfo = await payment.get({ id: paymentId })
      console.log("Status:", paymentInfo.status)
      console.log("Preference ID:", paymentInfo.preference_id)

      const estado =
        paymentInfo.status === "approved" ? "pagado" :
        paymentInfo.status === "rejected" ? "rechazado" :
        "pendiente"

      const { error } = await supabase
        .from("pedidos")
        .update({
          mp_status: paymentInfo.status,
          estado,
        })
        .eq("mp_payment_id", String(paymentInfo.preference_id))

      if (error) console.error("Supabase error:", error)
      else console.log("Pedido actualizado correctamente")
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}