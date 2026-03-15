"use client"

import { useEffect } from "react"
import { useProductos } from "../store/productosStore"

export default function Inicializador() {
  const cargarProductos = useProductos((state) => state.cargarProductos)

  useEffect(() => {
    // Cargar productos después de que el LCP termine
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => cargarProductos())
    } else {
      setTimeout(() => cargarProductos(), 100)
    }
  }, [cargarProductos])

  return null
}