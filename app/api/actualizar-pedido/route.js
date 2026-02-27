import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { preferenceId, status } = await request.json()

    const estado =
      status === "approved" ? "pagado" :
      status === "rejected" ? "rechazado" :
      "pendiente"

    const { error } = await supabase
      .from("pedidos")
      .update({
        mp_status: status,
        estado,
      })
      .eq("mp_payment_id", String(preferenceId))

    if (error) throw error
    return Response.json({ ok: true })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}