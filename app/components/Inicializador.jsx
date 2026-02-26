"use client"

import { useEffect } from "react"
import { useProductos } from "../store/productosStore"

export default function Inicializador() {
  const cargarProductos = useProductos((state) => state.cargarProductos)

  useEffect(() => {
    cargarProductos()
  }, [])

  return null
}