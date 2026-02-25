"use client"

import Link from "next/link"
import { useCarrito } from "../store/carritoStore"

export default function Navbar() {
  const items = useCarrito((state) => state.items)
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-xl font-black tracking-tighter text-white">
        COAM<span className="text-green-400">TEC</span>
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-zinc-400 hover:text-white transition text-sm">
          Inicio
        </Link>
        <Link href="/productos" className="text-zinc-400 hover:text-white transition text-sm">
          Productos
        </Link>
        <Link href="/carrito" className="relative text-zinc-400 hover:text-white transition text-sm">
          🛒 Carrito
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-4 bg-green-400 text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}