import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { verificarAdmin } from "../../lib/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  const auth = await verificarAdmin(req)
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  // Total de visitas
  const { count: totalVisitas } = await supabase
    .from("analytics")
    .select("*", { count: "exact", head: true })

  // Visitas hoy
  const { count: visitasHoy } = await supabase
    .from("analytics")
    .select("*", { count: "exact", head: true })
    .gte("created_at", hoy.toISOString())

  // Visitantes únicos total
  const { data: uniqueTotal } = await supabase
    .from("analytics")
    .select("visitor_id")
  const visitasUnicas = new Set(uniqueTotal?.map(v => v.visitor_id)).size

  // Visitantes únicos hoy
  const { data: uniqueHoy } = await supabase
    .from("analytics")
    .select("visitor_id")
    .gte("created_at", hoy.toISOString())
  const visitasUnicasHoy = new Set(uniqueHoy?.map(v => v.visitor_id)).size

  // Top páginas
  const { data: paginasData } = await supabase
    .from("analytics")
    .select("page")
  
  const conteo = {}
  paginasData?.forEach(p => {
    conteo[p.page] = (conteo[p.page] || 0) + 1
  })
  const topPaginas = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }))

  return NextResponse.json({
    totalVisitas: totalVisitas || 0,
    visitasHoy: visitasHoy || 0,
    visitasUnicas,
    visitasUnicasHoy,
    topPaginas,
  })
}
