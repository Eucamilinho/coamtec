"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Función para generar slug
const createSlug = (nombre, id) => {
  if (!nombre) return `producto-${id}`;
  const slug = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}-${id}`;
};

// Producto por defecto si no hay configuración en la base de datos
const productoDefault = {
  id: 39,
  nombre: "AULA WIN68 HE",
  tagline: "Switches Magnéticos Hall Effect",
  precio: 210000,
  caracteristicas: ["8000Hz", "Rapid Trigger", "Hot-Swap"],
  imagen: "https://lraxahespfbnnelztrjg.supabase.co/storage/v1/object/public/productos/1773526574355-0.jpg",
  imagen_destacada: null,
};

export default function HeroSection() {
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await fetch("/api/producto-destacado");
        const data = await res.json();
        if (data) {
          setProducto(data);
        } else {
          setProducto(productoDefault);
        }
      } catch (error) {
        console.error("Error cargando producto destacado:", error);
        setProducto(productoDefault);
      }
      setCargando(false);
    };
    cargarProducto();
  }, []);

  // Formatear precio de forma consistente
  const formatearPrecio = (precio) => {
    return precio?.toLocaleString('es-CO') || '0';
  };

  // Mostrar skeleton mientras carga
  if (cargando) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden pt-28 md:pt-32">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-6 animate-pulse" />
              <div className="h-12 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-4 animate-pulse mx-auto lg:mx-0" />
              <div className="h-6 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded mb-8 animate-pulse mx-auto lg:mx-0" />
              <div className="flex gap-2 justify-center lg:justify-start mb-10">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <div className="w-full max-w-md lg:max-w-lg aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-white dark:bg-black overflow-hidden">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black" />
      
      {/* Contenido */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-12 md:pt-36 md:pb-16 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Texto */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge minimalista */}
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-green-500 mb-6">
              Producto destacado
            </span>
            
            {/* Título */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              {producto.nombre}
            </h1>
            
            {/* Tagline */}
            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 mb-8">
              {producto.tagline}
            </p>
            
            {/* Características - pills minimalistas */}
            {producto.caracteristicas?.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-10">
                {producto.caracteristicas.map((caract, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 text-sm font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-full border border-zinc-200 dark:border-zinc-800"
                  >
                    {caract}
                  </span>
                ))}
              </div>
            )}
            
            {/* Precio y CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-1">Precio</p>
                <p className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                  ${formatearPrecio(producto.precio)}
                </p>
              </div>
              
              <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
              
              <Link
                href={`/productos/${createSlug(producto.nombre, producto.id)}`}
                className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all"
              >
                Comprar
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4"/>
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Imagen del producto */}
          <div className="order-1 lg:order-2 flex items-center justify-center pt-4">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
              {/* Sombra difusa debajo del producto */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/30 dark:bg-black/50 rounded-full blur-xl" />
              
              {/* Glow sutil detrás de la imagen */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl scale-75" />
              
              {/* Imagen PNG sin fondo */}
              <Image
                src={producto.imagen_destacada || producto.imagen}
                alt={`${producto.nombre} - Coam Tec Bucaramanga`}
                fill
                priority
                className="object-contain drop-shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-400 to-transparent dark:from-zinc-600" />
      </div>
    </section>
  );
}
