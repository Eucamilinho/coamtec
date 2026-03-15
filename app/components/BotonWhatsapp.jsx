"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useProductos } from "../store/productosStore";

const WHATSAPP_NUMBER = "573154968999";

const redesSociales = [
  {
    nombre: "Instagram",
    url: "https://instagram.com/coamtec",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    color: "hover:text-[#E1306C]",
  },
  {
    nombre: "Facebook",
    url: "https://facebook.com/coamtec",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: "hover:text-[#1877F2]",
  },
  {
    nombre: "TikTok",
    url: "https://tiktok.com/@coamtec1",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
    color: "hover:text-white",
  },
];

export default function BotonWhatsapp() {
  const pathname = usePathname();
  const productos = useProductos((state) => state.productos);
  const cargarProductos = useProductos((state) => state.cargarProductos);

  useEffect(() => {
    if (productos.length === 0) cargarProductos();
  }, [productos, cargarProductos]);

  const { url } = useMemo(() => {
    const partes = pathname.split("/");
    const esProducto = partes[1] === "productos" && partes[2];
    const slug = esProducto ? partes[2] : null;

    const producto = slug
      ? productos.find(p => {
          const parteSlug = slug.split("-");
          const idEnSlug = Number(parteSlug[parteSlug.length - 1]);
          return p.id === idEnSlug;
        })
      : null;

    const mensaje = producto
      ? `Hola! Estoy interesado en el ${producto.nombre} que vi en coamtec.com, ¿me puedes dar más información?`
      : "Hola! Estoy en coamtec.com y tengo una pregunta";

    return {
      url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    };
  }, [pathname, productos]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          REDES SOCIALES - Columna glass lateral derecha (medio de pantalla)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed z-40 right-4 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-2">
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 p-1.5 flex flex-col gap-1">
          {redesSociales.map((red) => (
            <a
              key={red.nombre}
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={red.nombre}
              className={`w-11 h-11 flex items-center justify-center rounded-xl text-zinc-500 dark:text-zinc-400 ${red.color} hover:bg-black/5 dark:hover:bg-white/5 transition-all`}
            >
              {red.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTÓN WHATSAPP - Esquina inferior derecha con logo oficial
      ═══════════════════════════════════════════════════════════════════════ */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed z-50 right-4 bottom-4 sm:right-6 sm:bottom-6 w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl bg-[#25D366] hover:bg-[#22c55e] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300/50"
        style={{ boxShadow: "0 8px 24px -4px rgba(37,211,102,0.5)" }}
      >
        {/* Logo oficial de WhatsApp */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.925 15.925 0 0016 32c8.822 0 16-7.178 16-16S24.822 0 16.004 0zm9.32 22.614c-.396 1.116-1.962 2.042-3.212 2.314-.852.182-1.964.328-5.71-1.226-4.79-1.99-7.878-6.844-8.12-7.158-.234-.314-1.936-2.574-1.936-4.91 0-2.336 1.224-3.478 1.658-3.954.396-.434.96-.542 1.284-.542.314 0 .628.004.904.018.3.016.69-.108.97.806.396 1.274 1.35 4.412 1.466 4.736.118.324.196.702.02 1.016-.166.314-.264.508-.528.806-.266.298-.52.586-.768.866-.256.284-.516.556-.21 1.06.306.504 1.358 2.172 2.914 3.514 1.996 1.724 3.682 2.26 4.2 2.512.52.25.82.21 1.12-.126.3-.334 1.268-1.478 1.608-1.984.34-.506.676-.424 1.134-.254.46.17 2.912 1.372 3.414 1.622.502.25.834.374.958.586.122.21.122 1.252-.274 2.366z" fill="#fff"/>
        </svg>
      </a>
    </>
  );
}
