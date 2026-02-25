import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TechStore",
  description: "Los mejores productos de tecnología",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}