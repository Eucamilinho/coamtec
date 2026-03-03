export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-zinc-200 dark:border-[#1E1E1E] bg-white dark:bg-[#111111] p-4 animate-pulse"
        >
          <div className="h-48 rounded-xl bg-zinc-200 dark:bg-[#1E1E1E]" />
          <div className="mt-4 h-4 w-24 rounded bg-zinc-200 dark:bg-[#1E1E1E]" />
          <div className="mt-3 h-5 w-3/4 rounded bg-zinc-200 dark:bg-[#1E1E1E]" />
          <div className="mt-4 h-7 w-32 rounded bg-zinc-200 dark:bg-[#1E1E1E]" />
          <div className="mt-4 h-10 rounded-xl bg-zinc-200 dark:bg-[#1E1E1E]" />
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
          className="rounded-2xl border border-zinc-200 dark:border-[#1E1E1E] bg-white dark:bg-[#111111] p-4 animate-pulse flex items-center gap-4"
        >
          <div className="h-24 w-24 rounded-xl bg-zinc-200 dark:bg-[#1E1E1E]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-[#1E1E1E]" />
            <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-[#1E1E1E]" />
            <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-[#1E1E1E]" />
          </div>
          <div className="w-24 space-y-2">
            <div className="h-6 rounded bg-zinc-200 dark:bg-[#1E1E1E]" />
            <div className="h-9 rounded-xl bg-zinc-200 dark:bg-[#1E1E1E]" />
          </div>
        </div>
      ))}
    </div>
  );
}
