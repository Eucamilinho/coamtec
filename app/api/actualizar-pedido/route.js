import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { preferenceId, status } = await request.json()
    console.log("Actualizando pedido:", preferenceId, status)

    const estado =
      status === "approved" || status === "success" ? "pagado" :
      status === "rejected" || status === "failure" ? "rechazado" :
      "pendiente"

    const { data, error } = await supabase
      .from("pedidos")
      .update({
        mp_status: status,
        estado,
      })
      .eq("mp_payment_id", preferenceId)
      .select()

    console.log("Resultado:", data, error)

    if (error) throw error
    return Response.json({ ok: true, data })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}