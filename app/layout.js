import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navbar from "./components/Navbar"
import Inicializador from "./components/Inicializador"
import ThemeProvider from "./components/ThemeProvider"
import AnalyticsTracker from "./components/AnalyticsTracker"
import BotonWhatsapp from "./components/BotonWhatsapp"

export const metadata = {
  metadataBase: new URL('https://coamtec.com'),
  title: {
    default: "Coam Tec | Accesorios Gamer Colombia",
    template: "%s | Coam Tec"
  },
  description: "Coam Tec es la tienda líder de accesorios gamer en Colombia. Teclados, mouse, audífonos y micrófonos gaming con envío a Bucaramanga, Bogotá, Medellín y todo Colombia.",
  keywords: ["Coam Tec", "accesorios gamer colombia", "teclados gamer bucaramanga", "mouse gamer bogotá", "audífonos gaming medellín", "teclados mecánicos colombia", "periféricos gamer bucaramanga", "tienda gamer colombia", "gaming colombia", "accesorios gaming bucaramanga", "teclados colombia", "mouse colombia", "gaming bucaramanga", "tienda gamer bucaramanga"],
  authors: [{ name: "Coam Tec" }],
  creator: "Coam Tec",
  publisher: "Coam Tec",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://coamtec.com',
    siteName: 'Coam Tec',
    title: 'Coam Tec | Accesorios Gamer Colombia - Bucaramanga',
    description: 'Coam Tec es la tienda líder de accesorios gamer en Colombia. Teclados, mouse, audífonos y micrófonos gaming con envío a Bucaramanga, Bogotá, Medellín y todo Colombia.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Coam Tec - Accesorios Gamer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coam Tec | Accesorios Gamer Colombia',
    description: 'Coam Tec es la tienda líder de accesorios gamer en Colombia',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export function generateViewport() {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
  };
}

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Coam Tec",
    alternateName: "CoamTec",
    url: "https://coamtec.com",
    logo: {
      "@type": "ImageObject", 
      url: "https://coamtec.com/logo.svg"
    },
    description: "Tienda líder de accesorios gamer en Colombia con cobertura en Bucaramanga, Bogotá, Medellín, Cali y todo el territorio nacional",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CO",
      addressRegion: "Santander",
      addressLocality: "Bucaramanga"
    },
    areaServed: [
      { "@type": "Country", "name": "Colombia" },
      { "@type": "City", "name": "Bucaramanga" },
      { "@type": "City", "name": "Bogotá" },
      { "@type": "City", "name": "Medellín" },
      { "@type": "City", "name": "Cali" },
      { "@type": "City", "name": "Barranquilla" }
    ],
    foundingDate: "2024",
    slogan: "Los mejores accesorios gamer de Colombia - Envío a Bucaramanga y todo el país",
    sameAs: []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Coam Tec",
    url: "https://coamtec.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://coamtec.com/productos?q={search_term_string}",
      "query-input": "required name search_term_string"
    }
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) theme = 'light';
                  document.documentElement.classList.add(theme);
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vvup628y65");
            `,
          }}
        />
        <link rel="preconnect" href="https://lraxahespfbnnelztrjg.supabase.co" />
        <link rel="dns-prefetch" href="https://lraxahespfbnnelztrjg.supabase.co" />
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className="bg-white dark:bg-black">
        <ThemeProvider>
          <Inicializador />
          <AnalyticsTracker />
          <Navbar />
          {children}
          <SpeedInsights />
          <Analytics />
          <BotonWhatsapp />
        </ThemeProvider>
      </body>
    </html>
  )
}
