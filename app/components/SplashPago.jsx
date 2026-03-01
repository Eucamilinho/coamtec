"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

export default function SplashPago({ src = "/logo.svg", minMs = 600 }) {
  const [visible, setVisible] = useState(true)
  const [showCheck, setShowCheck] = useState(false)

  useEffect(() => {
    const checkTimer = setTimeout(() => setShowCheck(true), minMs * 0.6)
    const hideTimer = setTimeout(() => setVisible(false), minMs)
    return () => {
      clearTimeout(checkTimer)
      clearTimeout(hideTimer)
    }
  }, [minMs])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="relative flex items-center justify-center">
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-50 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center shadow-2xl">
          <Image src={src} alt="logo" width={112} height={112} className="object-contain" />
        </div>
        {showCheck && (
          <div className="absolute -bottom-2 -right-2 animate-bounce">
            <CheckCircle2 size={40} className="text-green-400 fill-green-400" />
          </div>
        )}
      </div>
    </div>
  )
}
