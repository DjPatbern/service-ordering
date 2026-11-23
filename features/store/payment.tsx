"use client";

import { useRouter } from "next/navigation";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RefreshOrder() {
  const router = useRouter();
  return (
    <Button variant="secondary" onClick={() => router.refresh()}>
      <RefreshCw size={14} /> Check for updates
    </Button>
  );
}

export function CopyOrderLink() {
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Private order link copied");
        } catch {
          toast.error("Copy the link from your browser’s address bar.");
        }
      }}
    >
      <Copy size={14} /> Save your order link
    </Button>
  );
}
