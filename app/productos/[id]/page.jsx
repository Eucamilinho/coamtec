import { supabase } from "../../lib/supabase";
import DetalleProductoClient from "../../components/DetalleProducto";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const idNum = Number(resolvedParams.id);
  let producto = null;
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", idNum)
      .single();
    if (!error) producto = data;
  } catch (e) {
    console.error(e);
  }
  if (!producto) {
    return { title: "Producto no encontrado – Coam Tec" };
  }
  const titulo = `${producto.nombre} – Coam Tec`;
  return {
    title: titulo,
    description: producto.descripcion || "Accesorio gamer de calidad en Coam Tec",
    openGraph: {
      title: titulo,
      description: producto.descripcion || "Accesorio gamer de calidad en Coam Tec",
      images: [producto.imagen],
      url: `https://tu-dominio.com/productos/${producto.id}`,
    },
    alternates: {
      canonical: `/productos/${producto.id}`,
    },
  };
}

export default async function DetallePage({ params }) {
  const resolvedParams = await params;
  const idNum = Number(resolvedParams.id);
  let producto = null;
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", idNum)
      .single();
    if (!error) producto = data;
  } catch (e) {
    console.error(e);
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">
            Producto no encontrado
          </h1>
          <Link href="/productos" className="text-green-400 hover:underline">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  // structured data for SEO
  const productoSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: producto.nombre,
    image: [producto.imagen],
    description: producto.descripcion,
    sku: producto.id.toString(),
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: producto.precio,
      availability:
        producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://tu-dominio.com/productos/${producto.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productoSchema) }}
      />
      <DetalleProductoClient producto={producto} />
    </>
  );
}
