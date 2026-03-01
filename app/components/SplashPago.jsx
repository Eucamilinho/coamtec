"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Package, CreditCard, Loader2 } from "lucide-react"

export default function SplashPago({ src = "/logo.svg", minMs = 600 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), minMs)
    return () => clearTimeout(t)
  }, [minMs])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-28 h-28 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shadow-xl">
          <Image src={src} alt="logo" width={96} height={96} className="object-contain" />
        </div>
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <Package size={18} className="text-green-400" />
          <span className="font-semibold">Procesando pago</span>
          <Loader2 className="animate-spin" size={18} />
        </div>
      </div>
    </div>
  )
}
