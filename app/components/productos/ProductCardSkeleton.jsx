export function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden animate-pulse"
        >
          {/* Imagen skeleton */}
          <div className="aspect-square bg-zinc-100 dark:bg-zinc-800" />
          
          {/* Contenido */}
          <div className="p-4 space-y-3">
            {/* Categoría */}
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
            
            {/* Nombre */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            
            {/* Precio */}
            <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            
            {/* Botón */}
            <div className="h-10 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductListSkeleton({ count = 6 }) {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 animate-pulse"
        >
          {/* Imagen */}
          <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          
          {/* Contenido */}
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          
          {/* Acciones */}
          <div className="w-28 space-y-2">
            <div className="h-6 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
