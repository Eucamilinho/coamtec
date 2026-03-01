import { supabase } from "../lib/supabase";
import ProductosListado from "../components/ProductosListado";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  // we can't easily fetch here unless we make the function async and import supabase
  const titleParts = ["Productos", "Coam Tec"];
  if (sp?.categoria && sp.categoria !== "Todos") {
    titleParts.unshift(sp.categoria);
  }
  if (sp?.q) {
    titleParts.unshift(`Buscar: ${sp.q}`);
  }

  return {
    title: titleParts.join(" – "),
    description: "Explora nuestra tienda de accesorios gamer: teclados, mouse, audífonos y más con envío en Colombia.",
    openGraph: {
      title: titleParts.join(" – "),
      description: "Explora nuestra tienda de accesorios gamer: teclados, mouse, audífonos y más con envío en Colombia.",
      url: `https://tu-dominio.com/productos`,
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
      url: `https://tu-dominio.com/productos/${p.id}`,
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
