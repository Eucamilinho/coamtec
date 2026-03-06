import { MercadoPagoConfig, Preference } from "mercadopago"
import { createClient } from "@supabase/supabase-js"

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { items, formulario, subtotal, envio, total } = await request.json()
    
    // Debug logs para identificar el problema
    console.log('=== DEBUGGING MERCADOPAGO ===')
    console.log('Datos recibidos:', { 
      itemsCount: items?.length,
      formulario: {
        nombre: formulario?.nombre,
        email: formulario?.email,
        telefono: formulario?.telefono,
        ciudad: formulario?.ciudad,
        direccion: formulario?.direccion
      },
      subtotal, 
      envio, 
      total 
    })
    console.log('Variables de entorno:', {
      hasPublicKey: !!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
      hasAccessToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
      publicKeyFirst20: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY?.substring(0, 20),
      accessTokenFirst20: process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20),
      baseUrl: process.env.NEXT_PUBLIC_URL
    })

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
          surname: "", // Vacío si no tienes apellido separado
          email: formulario.email,
          phone: { 
            area_code: "57", // Código de Colombia
            number: formulario.telefono 
          },
          identification: {
            type: "CC", // Cédula de ciudadanía
            number: "12345678" // Número genérico, cambiar si tienes el real
          },
          address: {
            street_name: formulario.direccion,
            street_number: "123", // Número genérico
            zipcode: "12345", // Código postal genérico
            city: formulario.ciudad,
          },
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/checkout/resultado?status=success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/checkout/resultado?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/checkout/resultado?status=pending`,
        },
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
        auto_return: "approved",
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12 // Máximo cuotas
        },
        shipments: {
          cost: Number(envio),
          mode: "not_specified",
        },
        statement_descriptor: "COAMTEC", // Aparece en estado de cuenta
      },
    })

    console.log('PREFERENCIA CREADA:', {
      id: response.id,
      init_point: response.init_point,
      status: response.status,
      client_id: response.client_id,
      collector_id: response.collector_id
    })
    console.log('RESPUESTA COMPLETA DE MP:', response)
    console.log('=== FIN DEBUGGING ===')

    // Guardar pedido en Supabase
    await supabase.from("pedidos").insert([{
      nombre: formulario.nombre,
      email: formulario.email,
      telefono: formulario.telefono,
      departamento: formulario.departamento,
      ciudad: formulario.ciudad,
      direccion: formulario.direccion,
      referencia: formulario.referencia,
      metodo_pago: formulario.metodoPago,
      proveedor_envio: formulario.envioSeleccionado ? formulario.envioSeleccionado.empresa : 'Envío estándar',
      costo_envio: envio,
      tiempo_entrega: formulario.envioSeleccionado ? formulario.envioSeleccionado.tiempoEntrega : '3-5 días hábiles',
      zona_envio: formulario.envioSeleccionado ? formulario.envioSeleccionado.zona : 'zona3',
      subtotal,
      total,
      items,
      mp_payment_id: response.id,
      estado: "pendiente",
    }])

    return Response.json({ url: response.init_point })

  } catch (error) {
    console.error("=== ERROR MERCADOPAGO ===")
    console.error("Error completo:", error)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    if (error.response) {
      console.error("Error response status:", error.response.status)
      console.error("Error response data:", error.response.data)
    }
    console.error("=== FIN ERROR ===")
    return Response.json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    }, { status: 500 })
  }
}
