import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const eliminarImagenStorage = async (url) => {
  if (!url || url.includes("placehold.co")) return
  try {
    const nombreArchivo = url.split("/productos/")[1]
    if (!nombreArchivo) return
    await supabase.storage.from("productos").remove([nombreArchivo])
  } catch (error) {
    console.error("Error eliminando imagen:", error)
  }
}