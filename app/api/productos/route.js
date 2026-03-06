import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Cliente con service_role_key - bypassa RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Listar todos los productos
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

// POST - Crear producto
export async function POST(req) {
  const producto = await req.json()
  const { data, error } = await supabase
    .from("productos")
    .insert([producto])
    .select()

  if (error) {
    console.error("Error creando producto:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data[0])
}

// PUT - Editar producto
export async function PUT(req) {
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

// DELETE - Eliminar producto
export async function DELETE(req) {
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
