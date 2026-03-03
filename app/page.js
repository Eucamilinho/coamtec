import HomePageClient from "./components/home/HomePageClient";

export default function Home() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Coam Tec",
    url: "https://tu-dominio.com",
    logo: "https://tu-dominio.com/logo.svg",
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
