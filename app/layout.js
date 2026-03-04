import { Inter } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navbar from "./components/Navbar"
import Inicializador from "./components/Inicializador"
import ThemeProvider from "./components/ThemeProvider"
import AnalyticsTracker from "./components/AnalyticsTracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL('https://coamtec.com'),
  title: {
    default: "Coam Tec | Accesorios Gamer Colombia",
    template: "%s | Coam Tec"
  },
  description: "Coam Tec es la tienda líder de accesorios gamer en Colombia. Teclados, mouse, audífonos y micrófonos gaming con envío a todo el país.",
  keywords: ["Coam Tec", "accesorios gamer", "teclados gamer", "mouse gamer", "audífonos gaming", "micrófonos", "gaming colombia", "periféricos gamer", "tienda gamer colombia"],
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
    title: 'Coam Tec | Accesorios Gamer Colombia',
    description: 'Coam Tec es la tienda líder de accesorios gamer en Colombia. Teclados, mouse, audífonos y micrófonos gaming con envío a todo el país.',
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
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#09090b" },
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
    description: "Tienda líder de accesorios gamer en Colombia",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CO"
    },
    foundingDate: "2024",
    slogan: "Los mejores accesorios gamer de Colombia",
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
      "query-input": "required name=search_term_string"
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
                  if (!theme) theme = 'dark';
                  document.documentElement.classList.add(theme);
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* Preconnects para recursos críticos */}
        <link rel="preconnect" href="https://lraxahespfbnnelztrjg.supabase.co" />
        <link rel="dns-prefetch" href="https://lraxahespfbnnelztrjg.supabase.co" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className={`${inter.className} bg-white dark:bg-zinc-950`}>
        <ThemeProvider>
          <Inicializador />
          <AnalyticsTracker />
          <Navbar />
          {children}
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
