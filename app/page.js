import HomePageClient from "./components/home/HomePageClient";

export const metadata = {
  title: "Coam Tec | Teclados Gamer Bucaramanga - Accesorios Gaming Colombia",
  description: "Tienda líder de accesorios gamer en Bucaramanga y Colombia. Teclados mecánicos, mouse gaming, audífonos y micrófonos con envío rápido a toda Colombia. Pago contraentrega.",
  keywords: [
    "teclados gamer bucaramanga",
    "mouse gaming colombia", 
    "accesorios gamer santander",
    "periféricos gaming bucaramanga",
    "tienda gamer colombia",
    "teclados mecánicos bucaramanga",
    "setup gamer colombia",
    "teclado magnético colombia",
    "hall effect teclado",
    "rapid trigger colombia"
  ],
  openGraph: {
    title: "Coam Tec | Teclados Gamer Bucaramanga - Accesorios Gaming Colombia",
    description: "Tienda líder de accesorios gamer en Bucaramanga. Teclados mecánicos, mouse gaming, audífonos y micrófonos con envío rápido.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Coam Tec - Tienda de Accesorios Gamer en Colombia',
      }
    ],
  },
  alternates: {
    canonical: 'https://coamtec.com',
  },
};

export default function Home() {
  // Schema.org: Negocio Local
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://coamtec.com/#localbusiness",
    name: "Coam Tec",
    url: "https://coamtec.com",
    logo: "https://coamtec.com/logo.svg",
    image: "https://coamtec.com/og-image.png",
    description: "Tienda especializada en accesorios gaming en Bucaramanga con cobertura nacional. Teclados mecánicos, mouse gamer, audífonos y micrófonos.",
    telephone: "+573154968999",
    email: "contacto@coamtec.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bucaramanga",
      addressRegion: "Santander", 
      addressCountry: "CO"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 7.119349,
      longitude: -73.1227416
    },
    areaServed: [
      { "@type": "City", "name": "Bucaramanga" },
      { "@type": "City", "name": "Floridablanca" },
      { "@type": "City", "name": "Girón" },
      { "@type": "City", "name": "Piedecuesta" },
      { "@type": "Country", "name": "Colombia" }
    ],
    priceRange: "$$",
    openingHours: "Mo-Sa 09:00-18:00",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card", "PSE", "MercadoPago"],
    currenciesAccepted: "COP",
    sameAs: [
      "https://instagram.com/coamtec",
      "https://facebook.com/coamtec",
      "https://tiktok.com/@coamtec1"
    ],
  };

  // Schema.org: Producto Destacado
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AULA WIN68 HE - Teclado Gaming Switches Magnéticos",
    image: "https://lraxahespfbnnelztrjg.supabase.co/storage/v1/object/public/productos/1773526574355-0.jpg",
    description: "Teclado gaming AULA WIN68 HE con switches magnéticos Hall Effect, 8000Hz polling rate, Rapid Trigger ajustable y Hot-Swap. Ideal para gaming competitivo.",
    brand: {
      "@type": "Brand",
      name: "AULA"
    },
    sku: "AULA-WIN68-HE",
    offers: {
      "@type": "Offer",
      url: "https://coamtec.com/productos/teclado-gaming-aula-win68-he-switches-magneticos-8000hz-39",
      priceCurrency: "COP",
      price: "210000",
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Coam Tec"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "COP"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CO"
        }
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "47"
    }
  };

  // Schema.org: FAQ
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Hacen envíos a todo Colombia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, realizamos envíos a todo Colombia a través de transportadoras confiables. En Bucaramanga y área metropolitana ofrecemos entrega personalizada."
        }
      },
      {
        "@type": "Question",
        name: "¿Qué medios de pago aceptan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Aceptamos pago contraentrega en Bucaramanga y área metropolitana, transferencias, PSE, MercadoPago y tarjetas de crédito/débito."
        }
      },
      {
        "@type": "Question",
        name: "¿Los productos tienen garantía?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Todos nuestros productos son 100% originales y cuentan con garantía. Brindamos soporte postventa con atención personalizada."
        }
      }
    ]
  };

  // Schema.org: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://coamtec.com"
      }
    ]
  };

  return (
    <>
      {/* Schema.org: Local Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {/* Schema.org: Producto Destacado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Schema.org: FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Schema.org: Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HomePageClient />
    </>
  );
}
