import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import Inicializador from "./components/Inicializador"
import ThemeProvider from "./components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Coam Tec",
  description: "Los mejores accesorios gamer de Colombia",
  keywords: ["accesorios gamer", "teclados", "mouse", "audífonos", "micrófonos", "gaming"],
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
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://placehold.co" crossOrigin="true" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="preload" as="image" href="https://placehold.co/300x200" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Inicializador />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
