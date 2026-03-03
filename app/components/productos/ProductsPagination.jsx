export default function ProductsPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginación de productos"
    >
      <button
        type="button"
        aria-label="Página anterior"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 rounded-xl border border-zinc-300 dark:border-[#1E1E1E] px-4 text-sm font-semibold text-zinc-700 dark:text-[#FFFFFF] transition hover:border-blue-500 hover:text-blue-600 dark:hover:border-[#00ADB5] dark:hover:text-[#00ADB5] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`Ir a página ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
          className={`h-10 min-w-10 rounded-xl border text-sm font-bold transition ${
            page === currentPage
              ? "border-blue-600 bg-blue-600 text-white dark:border-[#00ADB5] dark:bg-[#00ADB5] dark:text-[#0E0E0E]"
              : "border-zinc-300 dark:border-[#1E1E1E] text-zinc-700 dark:text-[#FFFFFF] hover:border-blue-500 hover:text-blue-600 dark:hover:border-[#00ADB5] dark:hover:text-[#00ADB5]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        aria-label="Página siguiente"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 rounded-xl border border-zinc-300 dark:border-[#1E1E1E] px-4 text-sm font-semibold text-zinc-700 dark:text-[#FFFFFF] transition hover:border-blue-500 hover:text-blue-600 dark:hover:border-[#00ADB5] dark:hover:text-[#00ADB5] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </nav>
  );
}
