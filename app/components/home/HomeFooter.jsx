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
