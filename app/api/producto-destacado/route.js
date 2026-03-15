import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Cliente admin para operaciones privilegiadas
const getAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// GET - Obtener producto destacado
export async function GET() {
  try {
    // Obtener configuración del producto destacado
    const { data: config, error: configError } = await supabase
      .from("producto_destacado")
      .select("*")
      .single();

    // Si la tabla no existe o no hay configuración, retornar null (usará el default en frontend)
    if (configError) {
      // PGRST116 = no rows found, PGRST205 = table doesn't exist
      if (configError.code === "PGRST116" || configError.code === "PGRST205") {
        return NextResponse.json(null);
      }
      console.error("Error obteniendo config:", configError);
      return NextResponse.json(null);
    }

    // Si no hay configuración, retornar null
    if (!config) {
      return NextResponse.json(null);
    }

    // Obtener el producto completo
    const { data: producto, error: prodError } = await supabase
      .from("productos")
      .select("*")
      .eq("id", config.producto_id)
      .single();

    if (prodError) {
      console.error("Error obteniendo producto:", prodError);
      return NextResponse.json(null);
    }

    // Retornar el producto con la imagen destacada personalizada
    return NextResponse.json({
      ...producto,
      imagen_destacada: config.imagen_destacada,
      tagline: config.tagline,
      caracteristicas: config.caracteristicas || [],
    });
  } catch (error) {
    console.error("Error en API producto destacado:", error);
    return NextResponse.json(null);
  }
}

// POST - Guardar/Actualizar producto destacado
export async function POST(request) {
  try {
    const adminClient = getAdminClient();
    const body = await request.json();
    const { producto_id, imagen_destacada, tagline, caracteristicas } = body;

    if (!producto_id) {
      return NextResponse.json(
        { error: "producto_id es requerido" },
        { status: 400 }
      );
    }

    // Verificar si ya existe una configuración
    const { data: existing, error: checkError } = await adminClient
      .from("producto_destacado")
      .select("id")
      .single();

    let result;
    if (existing) {
      // Actualizar
      const { data, error } = await adminClient
        .from("producto_destacado")
        .update({
          producto_id,
          imagen_destacada,
          tagline,
          caracteristicas,
          actualizado_en: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Crear
      const { data, error } = await adminClient
        .from("producto_destacado")
        .insert({
          producto_id,
          imagen_destacada,
          tagline,
          caracteristicas,
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error guardando producto destacado:", error);
    return NextResponse.json(
      { error: "Error al guardar configuración" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto destacado
export async function DELETE() {
  try {
    const adminClient = getAdminClient();
    
    const { error } = await adminClient
      .from("producto_destacado")
      .delete()
      .neq("id", 0);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando producto destacado:", error);
    return NextResponse.json(
      { error: "Error al eliminar configuración" },
      { status: 500 }
    );
  }
}
