import HomePageClient from "./components/home/HomePageClient";

export const metadata = {
  title: "Coam Tec | Teclados Gamer Bucaramanga - Accesorios Gaming Colombia",
  description: "Tienda líder de accesorios gamer en Bucaramanga y Colombia. Teclados mecánicos, mouse gaming, audífonos y micrófonos con envío rápido a toda Colombia.",
  keywords: [
    "teclados gamer bucaramanga",
    "mouse gaming colombia", 
    "accesorios gamer santander",
    "periféricos gaming bucaramanga",
    "tienda gamer colombia",
    "teclados mecánicos bucaramanga",
    "setup gamer colombia"
  ],
  openGraph: {
    title: "Coam Tec | Teclados Gamer Bucaramanga - Accesorios Gaming Colombia",
    description: "Tienda líder de accesorios gamer en Bucaramanga. Envíos a toda Colombia.",
  }
};

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Coam Tec",
    url: "https://coamtec.com",
    logo: "https://coamtec.com/logo.svg",
    description: "Tienda especializada en accesorios gaming en Bucaramanga con cobertura nacional",
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
    areaServed: ["Bucaramanga", "Colombia", "Santander"],
    priceRange: "$$",
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HomePageClient />
    </>
  );
}
