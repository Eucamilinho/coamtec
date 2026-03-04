import { supabase } from "../../lib/supabase";
import DetalleProductoClient from "../../components/DetalleProducto";
import { getIdFromSlug, validateSlug, createSlug } from "../../lib/slugs";
import { redirect } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  
  if (!id) {
    return { title: "Producto no encontrado | Coam Tec" };
  }

  let producto = null;
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();
    if (!error) producto = data;
  } catch (e) {
    console.error(e);
  }

  if (!producto) {
    return { title: "Producto no encontrado | Coam Tec" };
  }

  // Verificar que el slug sea correcto, si no redirigir
  if (!validateSlug(resolvedParams.slug, producto.nombre, id)) {
    const correctSlug = createSlug(producto.nombre, id);
    redirect(`/productos/${correctSlug}`);
  }

  const titulo = `${producto.nombre} | Coam Tec`;
  const descripcion = producto.descripcion 
    ? producto.descripcion.replace(/<[^>]*>/g, '').slice(0, 160) 
    : `Compra ${producto.nombre} en Coam Tec. Envío a toda Colombia.`;
  
  return {
    title: titulo,
    description: descripcion,
    keywords: [producto.nombre, producto.categoria, 'accesorios gamer', 'gaming colombia'].filter(Boolean),
    openGraph: {
      title: titulo,
      description: descripcion,
      images: [{
        url: producto.imagen,
        width: 800,
        height: 600,
        alt: producto.nombre,
      }],
      url: `https://coamtec.com/productos/${resolvedParams.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcion,
      images: [producto.imagen],
    },
    alternates: {
      canonical: `https://coamtec.com/productos/${resolvedParams.slug}`,
    },
  };
}

export default async function DetallePage({ params }) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  
  if (!id) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
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

  let producto = null;
  let relacionados = [];
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("id", id)
      .single();
    if (!error) producto = data;

    if (!error && data?.categoria) {
      const { data: relacionadosData } = await supabase
        .from("productos")
        .select("*")
        .eq("categoria", data.categoria)
        .neq("id", id)
        .limit(4);

      if (relacionadosData) relacionados = relacionadosData;
    }
  } catch (e) {
    console.error(e);
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
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

  // Verificar slug correcto y redirigir si es necesario
  if (!validateSlug(resolvedParams.slug, producto.nombre, id)) {
    const correctSlug = createSlug(producto.nombre, id);
    redirect(`/productos/${correctSlug}`);
  }

  // Schema mejorado para SEO
  const precioFinal = producto.descuento > 0 
    ? producto.precio - (producto.precio * producto.descuento / 100) 
    : producto.precio;

  const productoSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: producto.nombre,
    image: producto.imagenes?.length > 0 ? producto.imagenes : [producto.imagen],
    description: producto.descripcion?.replace(/<[^>]*>/g, '') || producto.nombre,
    sku: producto.id.toString(),
    brand: {
      "@type": "Brand",
      name: "Coam Tec"
    },
    category: producto.categoria || "Accesorios Gamer",
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: precioFinal,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: producto.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      url: `https://coamtec.com/productos/${resolvedParams.slug}`,
      seller: {
        "@type": "Organization",
        name: "Coam Tec"
      }
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productoSchema) }}
      />
      <DetalleProductoClient producto={producto} relacionados={relacionados} />
    </>
  );
}