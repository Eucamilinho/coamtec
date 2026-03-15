import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  // Generar páginas a mostrar
  const getVisiblePages = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Siempre mostrar primera
    pages.push(1);

    // Calcular rango medio
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Ajustar si estamos cerca del inicio
    if (currentPage <= 3) {
      end = 4;
    }
    // Ajustar si estamos cerca del final
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    // Agregar ellipsis izquierdo
    if (start > 2) {
      pages.push("...");
    }

    // Agregar páginas del medio
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Agregar ellipsis derecho
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Siempre mostrar última
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-1"
      aria-label="Paginación"
    >
      {/* Botón anterior */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center text-sm text-zinc-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                page === currentPage
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Botón siguiente */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
