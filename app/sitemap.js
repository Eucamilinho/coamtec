import { supabase } from "./lib/supabase";
import { createSlug } from "./lib/slugs";

export default async function sitemap() {
  const baseUrl = "https://coamtec.com";

  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ubicaciones`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/carrito`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Productos dinámicos
  let productPages = [];
  try {
    const { data: productos, error } = await supabase
      .from("productos")
      .select("id, nombre, updated_at")
      .order("updated_at", { ascending: false });

    if (!error && productos) {
      productPages = productos.map((producto) => ({
        url: `${baseUrl}/productos/${createSlug(producto.nombre, producto.id)}`,
        lastModified: producto.updated_at ? new Date(producto.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (e) {
    console.error("Error fetching products for sitemap:", e);
  }

  return [...staticPages, ...productPages];
}
