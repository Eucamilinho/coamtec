import { MercadoPagoConfig, Preference } from "mercadopago"
import { createClient } from "@supabase/supabase-js"

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { items, formulario, subtotal, envio, total } = await request.json()

    // Crear preferencia en MercadoPago
    const preference = new Preference(mp)
    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          id: String(item.id),
          title: item.nombre,
          quantity: item.cantidad,
          unit_price: Number(item.precio),
          currency_id: "COP",
          picture_url: item.imagen,
        })),
        payer: {
          name: formulario.nombre,
          email: formulario.email,
          phone: { number: formulario.telefono },
          address: {
            street_name: formulario.direccion,
            city: formulario.ciudad,
          },
        },
        back_urls: {
  success: `http://localhost:3000/checkout/resultado?status=success`,
  failure: `http://localhost:3000/checkout/resultado?status=failure`,
  pending: `http://localhost:3000/checkout/resultado?status=pending`,
},
        // auto_return: "approved",
        shipments: {
          cost: envio,
          mode: "not_specified",
        },
      },
    })

    // Guardar pedido en Supabase
    await supabase.from("pedidos").insert([{
      nombre: formulario.nombre,
      email: formulario.email,
      telefono: formulario.telefono,
      departamento: formulario.departamento,
      ciudad: formulario.ciudad,
      direccion: formulario.direccion,
      referencia: formulario.referencia,
      metodo_envio: formulario.envio,
      metodo_pago: formulario.metodoPago,
      subtotal,
      costo_envio: envio,
      total,
      items,
      mp_payment_id: response.id,
      estado: "pendiente",
    }])

    console.log("URL:", process.env.NEXT_PUBLIC_URL)

    return Response.json({ url: response.init_point })

  } catch (error) {
    console.error("Error MercadoPago:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
