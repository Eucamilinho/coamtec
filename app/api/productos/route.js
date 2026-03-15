import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { verificarAdmin } from "../../lib/auth"

// Cliente con service_role_key - bypassa RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Listar todos los productos (público, no requiere auth)
export async function GET() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

// POST - Crear producto (requiere auth)
export async function POST(req) {
  const auth = await verificarAdmin(req)
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const producto = await req.json()
  const { data, error } = await supabase
    .from("productos")
    .insert([producto])
    .select()

  if (error) {
    console.error("Error creando producto:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Sincronizar con Google Merchant (no bloquea la respuesta)
  syncProductToMerchant({
    ...data[0],
    imagen: data[0].imagenes?.[0] || data[0].imagen || '',
    slug: data[0].slug || data[0].id
  })

  return NextResponse.json(data[0])
}

// PUT - Editar producto (requiere auth)
export async function PUT(req) {
  const auth = await verificarAdmin(req)
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id, ...resto } = await req.json()
  const { data, error } = await supabase
    .from("productos")
    .update(resto)
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error editando producto:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data[0])
}

// DELETE - Eliminar producto (requiere auth)
export async function DELETE(req) {
  const auth = await verificarAdmin(req)
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await req.json()
  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error eliminando producto:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

// --- Google Merchant Sync ---
const MERCHANT_ID = process.env.GOOGLE_MERCHANT_ID
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/content',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url')
  const crypto = await import('crypto')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = sign.sign(PRIVATE_KEY, 'base64url')
  const jwt = `${header}.${payload}.${signature}`
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const data = await response.json()
  return data.access_token
}

export async function syncProductToMerchant(producto) {
  try {
    const token = await getAccessToken()
    const merchantProduct = {
      offerId: `producto-${producto.id}`,
      title: producto.nombre,
      description: producto.descripcion,
      link: `${process.env.NEXT_PUBLIC_URL}/productos/${producto.slug || producto.id}`,
      imageLink: producto.imagenes?.[0] || producto.imagen || '',
      contentLanguage: 'es',
      targetCountry: 'CO',
      channel: 'online',
      availability: producto.stock > 0 ? 'in stock' : 'out of stock',
      condition: 'new',
      price: {
        value: String(producto.precio),
        currency: 'COP',
      },
      shipping: [{
        country: 'CO',
        price: {
          value: '0',
          currency: 'COP',
        },
      }],
    }
  
    const response = await fetch(
      `https://shoppingcontent.googleapis.com/content/v2.1/${MERCHANT_ID}/products`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(merchantProduct),
      }
    )
    const result = await response.json()
    console.log('📦 Respuesta Google Merchant:', JSON.stringify(result, null, 2))
    
    return result
  } catch (error) {
    // 👇 Más detalle del error
    console.error('❌ Error completo:', JSON.stringify(error, null, 2))
    console.error('❌ Mensaje:', error.message)
    console.error('❌ Stack:', error.stack)
  }
}
