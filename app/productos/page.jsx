import { supabase } from "../lib/supabase";
import { createSlug } from "../lib/slugs";
import ProductosListado from "../components/ProductosListado";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  
  const titleParts = ["Productos Gaming", "Coam Tec"];
  if (sp?.categoria && sp.categoria !== "Todos") {
    titleParts.unshift(sp.categoria);
  }
  if (sp?.q) {
    titleParts.unshift(`Buscar: ${sp.q}`);
  }

  // Generar descripción local dinámica
  let descripcion = "Tienda de accesorios gamer en Colombia: teclados mecánicos, mouse gaming, audífonos y micrófonos con envío a Bucaramanga, Bogotá, Medellín y toda Colombia.";
  
  if (sp?.categoria) {
    const descripciones = {
      "Teclados": "Teclados mecánicos y gamer en Colombia. Switches blue, red, brown con envío a Bucaramanga, Bogotá y todo el país.",
      "Mouse": "Mouse gamer y ergonómicos en Colombia. Alta precisión DPI y RGB con envío rápido desde Bucaramanga.",
      "Audífonos": "Audífonos gaming premium en Colombia. Sonido surround y micrófono profesional con envío nacional.",
      "Micrófonos": "Micrófonos streaming y gaming en Colombia. Calidad profesional con envío desde Bucaramanga."
    };
    descripcion = descripciones[sp.categoria] || descripcion;
  }

  return {
    title: titleParts.join(" – "),
    description: descripcion,
    keywords: [
      "productos gaming colombia",
      "accesorios gamer bucaramanga", 
      "teclados mecánicos colombia",
      "mouse gamer bogotá",
      "audífonos gaming medellín",
      "tienda gamer colombia"
    ],
    openGraph: {
      title: titleParts.join(" – "),
      description: descripcion,
      url: `https://coamtec.com/productos`,
    },
    alternates: {
      canonical: "/productos",
    },
  };
}

// Server component: fetch products from Supabase
export default async function ProductosPage({ searchParams }) {
  const sp = await searchParams;
  let productos = [];
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) productos = data;
  } catch (e) {
    console.error("Error fetching productos on server", e);
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: productos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://coamtec.com/productos/${createSlug(p.nombre, p.id)}`,
      name: p.nombre,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductosListado productos={productos} searchParams={sp} />
    </>
  );
}
