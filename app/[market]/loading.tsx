export default function Loading() {
  return (
    <main
      id="main-content"
      className="page-shell py-14"
      aria-busy="true"
      aria-label="Loading services"
    >
      <div className="mb-8 h-12 w-2/3 animate-pulse rounded-xl bg-stone-200" />
      <div className="mb-10 h-44 animate-pulse rounded-xl bg-stone-100" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-xl bg-stone-200/60"
          />
        ))}
      </div>
      <span className="sr-only" role="status">
        Bringing your next big idea into view…
      </span>
    </main>
  );
}
