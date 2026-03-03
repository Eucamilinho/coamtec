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

    // Actualizar estado del pedido
    const { data, error } = await supabase
      .from("pedidos")
      .update({
        mp_status: status,
        estado,
      })
      .eq("mp_payment_id", preferenceId)
      .select()

    if (error) throw error

    // Si fue pagado, restar stock de cada producto
    if (estado === "pagado" && data?.[0]?.items) {
      const items = data[0].items
      for (const item of items) {
        // Obtener stock actual
        const { data: producto } = await supabase
          .from("productos")
          .select("stock")
          .eq("id", item.id)
          .single()

        if (producto) {
          const nuevoStock = Math.max(0, producto.stock - item.cantidad)
          await supabase
            .from("productos")
            .update({ stock: nuevoStock })
            .eq("id", item.id)
        }
      }
    }

    console.log("Resultado:", data, error)
    return Response.json({ ok: true, data })
  } catch (error) {
    console.error("Error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}