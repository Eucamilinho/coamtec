import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">Coam Tec</h3>
            <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
              Tienda online especializada en accesorios gamer y tecnología para creadores.
              Experiencia de compra confiable, rápida y moderna.
            </p>
            {/* Redes sociales */}
            {/* Redes sociales */}
<div className="flex gap-3 mt-5">
  <a href="https://instagram.com/coamtec" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-[#E1306C] transition">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  </a>
  <a href="https://facebook.com/coamtec" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-[#1877F2] transition">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </a>
  <a href="https://tiktok.com/@coamtec1" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  </a>
</div>

{/* Medios de pago */}
<div className="flex flex-wrap gap-3 mt-6 items-center">
  {/* Visa */}
  <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center" style={{minWidth: 52}}>
    <svg width="38" height="13" viewBox="0 0 38 13" fill="none">
      <path d="M14.5 0.5L11.5 12.5H14.5L17.5 0.5H14.5Z" fill="#1A1F71"/>
      <path d="M26 0.5C25 0.5 23.5 1 23 2.5L18.5 12.5H21.5L22 11H25.5L26 12.5H29L26 0.5ZM22.5 8.5L24 4L24.5 8.5H22.5Z" fill="#1A1F71"/>
      <path d="M10 0.5L7 9L6.5 6.5C5.5 4 3.5 2 1 1L3.5 12.5H6.5L14 0.5H10Z" fill="#1A1F71"/>
      <path d="M0 0.5C2.5 1 5 3 6 6L7 9L4 0.5H0Z" fill="#F9A533"/>
    </svg>
  </div>

  {/* Mastercard */}
  <div className="bg-white rounded-md px-2 py-1.5 flex items-center justify-center gap-1">
    <div className="w-6 h-6 rounded-full bg-[#EB001B]" />
    <div className="w-6 h-6 rounded-full bg-[#F79E1B] -ml-3 opacity-90" />
  </div>

  {/* PSE */}
  <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
    <span className="text-[#003087] font-black text-sm tracking-tight">PSE</span>
  </div>

  {/* MercadoPago */}
  <div className="bg-[#009EE3] rounded-md px-3 py-1.5 flex items-center justify-center">
    <span className="text-white font-black text-xs tracking-tight">Mercado Pago</span>
  </div>

  <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
    🔒 Pagos 100% seguros
  </span>
</div>
          </div>

          <nav aria-label="Navegación principal">
            <h4 className="font-semibold text-zinc-900 dark:text-white">Navegación</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/" className="hover:text-blue-600 dark:hover:text-green-400">Inicio</Link></li>
              <li><Link href="/productos" className="hover:text-blue-600 dark:hover:text-green-400">Productos</Link></li>
              <li><Link href="/carrito" className="hover:text-blue-600 dark:hover:text-green-400">Carrito</Link></li>
            </ul>
          </nav>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><span>Privacidad</span></li>
              <li><span>Términos</span></li>
              <li><span>Soporte</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Coam Tec. Todos los derechos reservados.</p>
          <p>Hecho con foco en rendimiento y accesibilidad.</p>
        </div>
      </div>
    </footer>
  );
}
