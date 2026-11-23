export default function Loading() {
  return (
    <main
      id="main-content"
      className="page-shell min-h-[65vh] py-14"
      aria-busy="true"
    >
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-stone-200" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-xl bg-stone-100"
          />
        ))}
      </div>
      <span className="sr-only" role="status">
        Loading Zhoppin…
      </span>
    </main>
  );
}
