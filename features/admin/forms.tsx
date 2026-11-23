"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultCategories,
  statusLabels,
  canTransition,
  type Product,
  type OrderStatus,
} from "@/features/store/schema";
async function post(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          await post(
            "/api/admin/login",
            Object.fromEntries(new FormData(e.currentTarget)),
          );
          router.replace("/admin");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Sign-in failed.");
          setBusy(false);
        }
      }}
      className="mt-7 space-y-5"
    >
      <label className="block text-xs font-semibold">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="field mt-2"
        />
      </label>
      <label className="block text-xs font-semibold">
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          maxLength={256}
          className="field mt-2"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-brand">
          {error}
        </p>
      )}
      <Button disabled={busy} className="w-full">
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
export function AdminAction({
  action,
  label,
}: {
  action: "logout" | "seed";
  label: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <Button
        variant="secondary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await post(`/api/admin/${action}`, {});
            if (action === "logout") router.replace("/admin/login");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Request failed.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Please wait…" : label}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-brand">
          {error}
        </p>
      )}
    </div>
  );
}
const empty: Product = {
  slug: "",
  name: "",
  category: defaultCategories[0],
  description: "",
  price: 0,
  image: "",
  specs: [],
  published: false,
  purchasable: false,
  stock: 0,
  featured: false,
};
export function ProductForm({
  product = empty,
  categories,
}: {
  product?: Product;
  categories: string[];
}) {
  const router = useRouter();
  const [image, setImage] = useState(product.image);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file: File) {
    setError("");
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be no larger than 2 MB.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }
  return (
    <form
      className="mt-7 grid gap-5 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        const form = new FormData(e.currentTarget);
        try {
          await post("/api/admin/products", {
            slug: form.get("slug"),
            name: form.get("name"),
            category: form.get("category"),
            description: form.get("description"),
            price: Math.round(Number(form.get("price")) * 100),
            image,
            specs: String(form.get("specs"))
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            stock: Number(form.get("stock")),
            published: form.get("published") === "on",
            purchasable: form.get("purchasable") === "on",
            featured: form.get("featured") === "on",
          });
          router.push("/admin/products");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Save failed.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="text-xs font-semibold">
        Product name
        <input
          className="field mt-2"
          name="name"
          required
          minLength={3}
          maxLength={120}
          defaultValue={product.name}
        />
      </label>
      <label className="text-xs font-semibold">
        URL slug{" "}
        <span className="font-normal text-muted">(permanent identifier)</span>
        <input
          className="field mt-2"
          name="slug"
          required
          minLength={3}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          readOnly={!!product.slug}
          defaultValue={product.slug}
          placeholder="example-product-name"
        />
      </label>
      <label className="text-xs font-semibold">
        Category
        <select
          className="field mt-2"
          name="category"
          defaultValue={product.category}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold">
        Price in naira (₦)
        <input
          className="field mt-2"
          name="price"
          type="number"
          min="1"
          step="0.01"
          required
          defaultValue={product.price / 100 || ""}
        />
      </label>
      <label className="text-xs font-semibold sm:col-span-2">
        Description
        <textarea
          className="field mt-2"
          name="description"
          required
          minLength={20}
          maxLength={4000}
          defaultValue={product.description}
          rows={4}
        />
      </label>
      <label className="text-xs font-semibold sm:col-span-2">
        Specifications{" "}
        <span className="font-normal text-muted">(one per line, up to 12)</span>
        <textarea
          className="field mt-2"
          name="specs"
          defaultValue={product.specs.join("\n")}
          rows={4}
        />
      </label>
      <label className="text-xs font-semibold">
        Available stock{" "}
        <span className="font-normal text-muted">
          (excluding already reserved units)
        </span>
        <input
          className="field mt-2"
          name="stock"
          type="number"
          min="0"
          max="100000"
          step="1"
          required
          defaultValue={product.stock}
        />
      </label>
      <label className="text-xs font-semibold">
        Product image (JPG / PNG / WebP, max 2 MB)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            if (e.target.files?.[0]) void upload(e.target.files[0]);
          }}
          className="field mt-2"
        />
        <span className="mt-2 block text-[10px] font-normal text-muted">
          {uploading
            ? "Uploading…"
            : image
              ? "Image ready. Upload another to replace it."
              : "Upload an image before saving."}
        </span>
      </label>
      <div className="space-y-4 rounded-xl bg-cream p-5 sm:col-span-2">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product.published}
            className="size-4 accent-brand"
          />
          Publish on the storefront
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="purchasable"
            defaultChecked={product.purchasable}
            className="size-4 accent-brand"
          />
          Enable checkout — price and stock have been confirmed
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product.featured}
            className="size-4 accent-brand"
          />
          <Star size={16} className="text-brand" />
          Feature as Product of the Week
        </label>
        <p className="text-xs leading-6 text-muted">
          Add to bag appears only when checkout is enabled and Available stock
          is 1 or more. Leave checkout off to keep a product enquiry-only.
          Unpublish a product to hide it. Existing order snapshots are retained.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-brand sm:col-span-2">
          {error}
        </p>
      )}
      <Button disabled={busy || uploading || !image} className="sm:col-span-2">
        {busy ? "Saving…" : "Save product"}
      </Button>
      {product.slug && (
        <Button
          type="button"
          variant="secondary"
          className="border-red-200 text-red-700 sm:col-span-2"
          disabled={busy}
          onClick={async () => {
            if (
              !window.confirm(
                `Delete ${product.name}? Past order records will remain, but this cannot be undone.`,
              )
            )
              return;
            setBusy(true);
            setError("");
            try {
              const response = await fetch(
                `/api/admin/products?slug=${encodeURIComponent(product.slug)}`,
                { method: "DELETE" },
              );
              const data = await response.json();
              if (!response.ok) throw new Error(data.error);
              router.replace("/admin/products");
              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Delete failed.");
              setBusy(false);
            }
          }}
        >
          <Trash2 size={16} /> Delete product
        </Button>
      )}
    </form>
  );
}

export function CategoryManager({ categories }: { categories: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  async function request(method: string, body?: unknown, query = "") {
    setError("");
    const response = await fetch(`/api/admin/categories${query}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Please try again.");
    router.refresh();
  }
  return (
    <div className="grid items-start gap-7 lg:grid-cols-[1fr_1.5fr]">
      <form
        className="rounded-2xl border border-line p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          setBusy("new");
          try {
            await request("POST", { name: new FormData(form).get("name") });
            form.reset();
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Could not add category.",
            );
          } finally {
            setBusy("");
          }
        }}
      >
        <h2 className="text-lg font-bold">Add category</h2>
        <p className="mt-2 text-xs leading-6 text-muted">
          Categories appear in the store filter and product editor.
        </p>
        <label className="mt-5 block text-xs font-semibold">
          Category name
          <input
            name="name"
            required
            minLength={2}
            maxLength={60}
            className="field mt-2"
          />
        </label>
        <Button className="mt-4" disabled={busy === "new"}>
          {busy === "new" ? "Adding…" : "Add category"}
        </Button>
      </form>
      <section className="overflow-hidden rounded-2xl border border-line">
        <h2 className="bg-cream px-5 py-4 text-sm font-bold">
          Store categories
        </h2>
        <div className="divide-y divide-line">
          {categories.map((category) => (
            <form
              key={category}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(category);
                try {
                  await request("PATCH", {
                    currentName: category,
                    name: new FormData(event.currentTarget).get("name"),
                  });
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Could not update category.",
                  );
                } finally {
                  setBusy("");
                }
              }}
            >
              <input
                name="name"
                aria-label={`Rename ${category}`}
                defaultValue={category}
                required
                minLength={2}
                maxLength={60}
                className="field flex-1"
              />
              <Button variant="secondary" disabled={!!busy}>
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="text-red-700"
                disabled={!!busy}
                aria-label={`Delete ${category}`}
                onClick={async () => {
                  if (!window.confirm(`Delete the ${category} category?`))
                    return;
                  setBusy(category);
                  try {
                    await request(
                      "DELETE",
                      undefined,
                      `?name=${encodeURIComponent(category)}`,
                    );
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Could not delete category.",
                    );
                  } finally {
                    setBusy("");
                  }
                }}
              >
                <Trash2 size={15} />
              </Button>
            </form>
          ))}
        </div>
      </section>
      {error && (
        <p role="alert" className="text-sm text-brand lg:col-span-2">
          {error}
        </p>
      )}
    </div>
  );
}
export function OrderActions({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const options = (
    [
      "awaiting_payment",
      "paid",
      "payment_rejected",
      "dispatched",
      "completed",
      "cancelled",
    ] as OrderStatus[]
  ).filter((next) => canTransition(status, next));
  if (!options.length)
    return (
      <p className="mt-6 text-sm text-muted">
        This order has no further actions.
      </p>
    );
  return (
    <form
      className="mt-6 space-y-5 rounded-xl border border-line p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const form = new FormData(e.currentTarget);
        const shipping = form.get("shipping");
        try {
          await post(`/api/admin/orders/${id}`, {
            status: form.get("status"),
            ...(shipping !== null && shipping !== ""
              ? { shipping: Math.round(Number(shipping) * 100) }
              : {}),
            note: form.get("note") || "",
            confirmReceived: form.get("confirmReceived") === "on",
          });
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Update failed.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-lg font-bold">Update this order</h2>
      <label className="block text-xs font-semibold">
        Next status
        <select name="status" className="field mt-2">
          {options.map((next) => (
            <option value={next} key={next}>
              {statusLabels[next]}
            </option>
          ))}
        </select>
      </label>
      {status === "awaiting_delivery_quote" && (
        <label className="block text-xs font-semibold">
          Confirmed delivery fee (₦)
          <input
            className="field mt-2"
            type="number"
            name="shipping"
            min="0"
            step="0.01"
            placeholder="Enter 0 only for confirmed free delivery"
          />
          <span className="mt-2 block text-xs font-normal text-muted">
            Confirming the quote reserves stock and unlocks payment. Contact the
            customer with their private order link.
          </span>
        </label>
      )}
      <label className="block text-xs font-semibold">
        Customer-visible note / courier tracking details
        <textarea className="field mt-2" name="note" maxLength={500} rows={3} />
      </label>
      {status === "payment_submitted" && (
        <label className="flex items-start gap-3 text-xs leading-6">
          <input
            type="checkbox"
            name="confirmReceived"
            className="mt-1 size-4 shrink-0 accent-brand"
          />
          I checked the Fidelity Bank account and confirm the full order total
          was credited. A WhatsApp receipt alone is not payment verification.
        </label>
      )}
      {error && (
        <p role="alert" className="text-sm text-brand">
          {error}
        </p>
      )}
      <Button disabled={busy}>{busy ? "Updating…" : "Update order"}</Button>
    </form>
  );
}

export function DeleteOrderButton({
  id,
  reference,
}: {
  id: string;
  reference: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="mt-7 rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-bold text-red-900">Delete order</h2>
      <p className="mt-2 text-xs leading-6 text-red-800">
        This permanently removes the customer details, tracking page and any
        stored payment proof. Reserved stock is restored only when the order has
        not been marked paid.
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      )}
      <Button
        type="button"
        variant="secondary"
        disabled={busy}
        className="mt-4 border-red-300 text-red-800 hover:bg-red-100"
        onClick={async () => {
          const confirmation = window.prompt(
            `This cannot be undone. Type ${reference} to permanently delete this order.`,
          );
          if (confirmation !== reference) {
            if (confirmation !== null)
              setError(`Enter ${reference} exactly to confirm deletion.`);
            return;
          }
          setBusy(true);
          setError("");
          try {
            const response = await fetch(`/api/admin/orders/${id}`, {
              method: "DELETE",
            });
            const data = await response.json();
            if (!response.ok)
              throw new Error(data.error || "Could not delete order.");
            router.replace("/admin");
            router.refresh();
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Could not delete order.",
            );
            setBusy(false);
          }
        }}
      >
        <Trash2 size={16} /> {busy ? "Deleting…" : "Delete order permanently"}
      </Button>
    </section>
  );
}
