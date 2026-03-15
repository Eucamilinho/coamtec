import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function actualizarStock(items) {
  const resultados = []
  
  for (const item of items) {
    try {
      // Obtener stock actual del producto
      const { data: producto, error: errorProducto } = await supabase
        .from("productos")
        .select("stock, nombre")
        .eq("id", item.id)
        .single()

      if (errorProducto) {
        console.error(`Error obteniendo producto ${item.id}:`, errorProducto)
        resultados.push({ id: item.id, error: errorProducto.message })
        continue
      }

      if (!producto) {
        console.error(`Producto ${item.id} no encontrado`)
        resultados.push({ id: item.id, error: "Producto no encontrado" })
        continue
      }

      // Validar que hay suficiente stock
      if (producto.stock < item.cantidad) {
        console.error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, Requerido: ${item.cantidad}`)
        resultados.push({ 
          id: item.id, 
          error: "Stock insuficiente", 
          stockDisponible: producto.stock,
          cantidadRequerida: item.cantidad
        })
        continue
      }

      // Actualizar stock
      const nuevoStock = Math.max(0, producto.stock - item.cantidad)
      const { error: errorActualizar } = await supabase
        .from("productos")
        .update({ stock: nuevoStock })
        .eq("id", item.id)

      if (errorActualizar) {
        console.error(`Error actualizando stock del producto ${item.id}:`, errorActualizar)
        resultados.push({ id: item.id, error: errorActualizar.message })
      } else {
        console.log(`✅ Stock actualizado: ${producto.nombre} - ${producto.stock} → ${nuevoStock}`)
        resultados.push({ 
          id: item.id, 
          nombre: producto.nombre,
          stockAnterior: producto.stock,
          nuevoStock,
          cantidadDescontada: item.cantidad,
          success: true
        })
      }

    } catch (error) {
      console.error(`Error procesando producto ${item.id}:`, error)
      resultados.push({ id: item.id, error: error.message })
    }
  }

  return resultados
}

export async function POST(request) {
  try {
    const { items } = await request.json()
    
    if (!items || !Array.isArray(items)) {
      return Response.json({ 
        error: "Items inválidos" 
      }, { status: 400 })
    }

    const resultados = await actualizarStock(items)
    
    // Verificar si hubo errores
    const errores = resultados.filter(r => !r.success)
    const exitosos = resultados.filter(r => r.success)

    return Response.json({
      success: errores.length === 0,
      actualizados: exitosos.length,
      errores: errores.length,
      detalles: resultados
    })

  } catch (error) {
    console.error("Error en actualizar-stock:", error)
    return Response.json({ 
      error: error.message 
    }, { status: 500 })
  }
}