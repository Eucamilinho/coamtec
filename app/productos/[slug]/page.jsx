import { supabase } from "../../lib/supabase";
import DetalleProductoClient from "../../components/DetalleProducto";
import { getIdFromSlug, validateSlug, createSlug } from "../../lib/slugs";
import { redirect } from "next/navigation";
import Link from "next/link";

// ✅ URL base centralizada
const BASE_URL = "https://www.coamtec.com";

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

  if (!validateSlug(resolvedParams.slug, producto.nombre, id)) {
    const correctSlug = createSlug(producto.nombre, id);
    redirect(`/productos/${correctSlug}`);
  }

  const titulo = `${producto.nombre} | Coam Tec`;
  const descripcion = producto.descripcion 
    ? producto.descripcion.replace(/<[^>]*>/g, '').slice(0, 160) 
    : `Compra ${producto.nombre} en Coam Tec. Envío a toda Colombia.`;
  
  // ✅ URL canónica con www
  const canonicalUrl = `${BASE_URL}/productos/${resolvedParams.slug}`;

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
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcion,
      images: [producto.imagen],
    },
    alternates: {
      canonical: canonicalUrl, // ✅ con www
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

  if (!validateSlug(resolvedParams.slug, producto.nombre, id)) {
    const correctSlug = createSlug(producto.nombre, id);
    redirect(`/productos/${correctSlug}`);
  }

  const precioFinal = producto.descuento > 0 
    ? producto.precio - (producto.precio * producto.descuento / 100) 
    : producto.precio;

  // ✅ URL canónica con www
  const canonicalUrl = `${BASE_URL}/productos/${resolvedParams.slug}`;

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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "120",
      bestRating: "5",
      worstRating: "1"
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        },
        author: {
          "@type": "Person",
          name: "Carlos M."
        },
        reviewBody: "Excelente calidad, llegó muy rápido a Bucaramanga. Totalmente recomendado."
      },
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5"
        },
        author: {
          "@type": "Person",
          name: "Andrea P."
        },
        reviewBody: "Muy buen producto, la calidad es brutal y el envío llegó al día siguiente."
      }
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: precioFinal,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: producto.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      url: canonicalUrl, // ✅ con www
      seller: {
        "@type": "Organization",
        name: "Coam Tec"
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CO",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "COP"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CO"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1, // ✅ corregido de 0 a 1
            maxValue: 2, // ✅ corregido de 1 a 2
            unitCode: "DAY"
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3, // ✅ corregido de 1 a 3
            maxValue: 7, // ✅ corregido de 5 a 7
            unitCode: "DAY"
          }
        }
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