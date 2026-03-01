"use client"

import { useEffect, useState } from "react"
import { useProductos } from "../store/productosStore"
import SplashPago from "./SplashPago"

export default function Inicializador() {
  const cargarProductos = useProductos((state) => state.cargarProductos)
  const cargando = useProductos((state) => state.cargando)
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    // Start loading products
    cargarProductos()
  }, [cargarProductos])

  useEffect(() => {
    // Show splash while cargando; keep at least 600ms to avoid flicker
    if (cargando) setShowSplash(true)
    else {
      const t = setTimeout(() => setShowSplash(false), 300)
      return () => clearTimeout(t)
    }
  }, [cargando])

  return showSplash ? <SplashPago src="/logo.svg" minMs={600} /> : null
}