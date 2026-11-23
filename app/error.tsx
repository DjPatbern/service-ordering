"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="page-shell py-24 text-center">
      <p className="eyebrow">A quick interruption</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">
        Let’s try that again.
      </h1>
      <p className="mt-4 text-sm text-muted">
        We couldn’t load this page. Your shopping bag is still saved here.
      </p>
      <Button onClick={reset} className="mt-6">
        <RefreshCw size={16} /> Try again
      </Button>
    </main>
  );
}
