"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function SplashScreen({ minMs = 1200 }) {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), minMs - 300)
    const hideTimer = setTimeout(() => setVisible(false), minMs)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [minMs])

  if (!visible) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Fondo con gradiente animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[80px] animate-pulse delay-300" />
      </div>

      {/* Contenido central */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo con animación */}
        <div className="relative">
          {/* Logo con efecto de escala */}
          <div className="relative w-24 h-24 animate-bounce" style={{ animationDuration: '2s' }}>
            <Image 
              src="/logo.svg" 
              alt="Coam Tec" 
              fill 
              className="object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              priority
            />
          </div>
        </div>

        {/* Texto con efecto typing */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-white">COAM</span>
            <span className="text-green-500">TEC</span>
          </h1>
          
          {/* Barra de carga */}
          <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-cyan-400 rounded-full animate-loading"
              style={{ 
                animation: `loading ${minMs - 200}ms ease-out forwards`
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
