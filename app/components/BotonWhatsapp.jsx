"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useProductos } from "../store/productosStore";


const WHATSAPP_NUMBER = "573154968999";

export default function BotonWhatsapp() {
  const pathname = usePathname();
  const productos = useProductos((state) => state.productos);
  const cargarProductos = useProductos((state) => state.cargarProductos);

  useEffect(() => {
    if (productos.length === 0) cargarProductos();
  }, [productos, cargarProductos]);

  const { mensaje, url } = useMemo(() => {
    const partes = pathname.split("/");
    const esProducto = partes[1] === "productos" && partes[2];
    const productoId = esProducto ? Number(partes[2]) : null;
    const slug = esProducto ? partes[2] : null;

// Buscar por slug o por id dentro del slug (el número al final)
const producto = slug
  ? productos.find(p => {
      // El slug termina con el id del producto
      const parteSlug = slug.split("-")
      const idEnSlug = Number(parteSlug[parteSlug.length - 1])
      return p.id === idEnSlug
    })
  : null
    const mensaje = producto
      ? `Hola! Estoy interesado en el ${producto.nombre} que vi en coamtec.com, ¿me puedes dar más información?`
      : "Hola! Estoy en coamtec.com y tengo una pregunta";
    return {
      mensaje,
      url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    };
  }, [pathname, productos]);

  return (
    <div className="fixed z-50 right-4 bottom-4 sm:right-6 sm:bottom-6 flex flex-col items-end group">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="w-14 h-14 flex items-center justify-center rounded-full shadow-2xl bg-[#25D366] hover:scale-110 transition-transform duration-200 animate-pulse focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
        style={{ boxShadow: "0 8px 32px 0 rgba(37,211,102,0.35)" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="none" />
          <path d="M16 6C10.477 6 6 10.477 6 16c0 1.624.438 3.162 1.2 4.48L6 26l5.68-1.16A9.96 9.96 0 0016 26c5.523 0 10-4.477 10-10S21.523 6 16 6zm0 18c-1.624 0-3.162-.438-4.48-1.2l-.32-.16-3.36.68.68-3.36-.16-.32A7.96 7.96 0 018 16c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8zm4.32-5.68c-.24-.12-1.418-.7-1.638-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.018-.374-1.94-1.192-.718-.604-1.204-1.35-1.346-1.574-.14-.24-.016-.37.104-.49.108-.108.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.43-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.54.58.2 1.03.32 1.38.41.58.14 1.1.12 1.52.07.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" fill="#fff" />
        </svg>
      </a>
      <span className="block mt-2 px-3 py-1 rounded-lg bg-zinc-900 text-white text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none">
        ¿Tienes dudas?
      </span>
    </div>
  );
}