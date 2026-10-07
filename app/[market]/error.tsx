"use client";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="page-shell py-24 text-center">
      <p className="text-xs font-semibold tracking-widest text-brand uppercase">
        A little interruption
      </p>
      <h1 className="mt-4 font-display text-4xl">
        Let’s give that another try.
      </h1>
      <p className="mt-4 text-sm text-muted">
        We couldn’t load this page. Your saved bag is still here.
      </p>
      <Button onClick={reset} className="mt-6">
        <RefreshCw size={16} />
        Try again
      </Button>
    </main>
  );
}
