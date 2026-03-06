import { createClient } from "@supabase/supabase-js"

// Verifica que el request viene de un usuario autenticado en Supabase
export async function verificarAdmin(request) {
  const authHeader = request.headers.get("authorization")
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "No autorizado", status: 401 }
  }

  const token = authHeader.replace("Bearer ", "")

  // Crear cliente con el token del usuario para verificar su sesión
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      }
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return { error: "Sesión inválida", status: 401 }
  }

  return { user }
}
