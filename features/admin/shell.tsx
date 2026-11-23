import { AdminAction } from "./forms";
import { AdminNav } from "./nav";
export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="page-shell min-h-[70vh] py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Zhoppin control room</p>
          <h1 className="mt-3 text-3xl font-bold">{title}</h1>
        </div>
        <AdminAction action="logout" label="Sign out" />
      </div>
      <AdminNav />
      {children}
    </main>
  );
}
