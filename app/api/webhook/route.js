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

    if (body.type === "payment") {
      const paymentId = body.data.id
      const payment = new Payment(mp)
      const paymentInfo = await payment.get({ id: paymentId })

      const estado =
        paymentInfo.status === "approved" ? "pagado" :
        paymentInfo.status === "rejected" ? "rechazado" :
        "pendiente"

      // Buscar pedido por mp_payment_id y actualizar
      await supabase
        .from("pedidos")
        .update({
          mp_status: paymentInfo.status,
          estado,
        })
        .eq("mp_payment_id", String(paymentInfo.preference_id))
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}