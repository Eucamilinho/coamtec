import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import Inicializador from "./components/Inicializador"
import ThemeProvider from "./components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Coam Tec",
  description: "Los mejores accesorios gamer de Colombia",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
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