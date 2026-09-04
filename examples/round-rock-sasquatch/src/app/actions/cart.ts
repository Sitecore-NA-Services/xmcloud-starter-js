"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CART_COOKIE, ORDER_COOKIE } from "src/lib/cart";

interface CartEntry {
  slug: string;
  qty: number;
}

const CART_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

const ORDER_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 10,
};

async function readCart(): Promise<CartEntry[]> {
  const c = (await cookies()).get(CART_COOKIE);
  if (!c) return [];
  try {
    const parsed = JSON.parse(c.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCart(items: CartEntry[]): Promise<void> {
  (await cookies()).set(CART_COOKIE, JSON.stringify(items), CART_OPTIONS);
}

export async function addToCart(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const qty = Math.max(1, parseInt(String(formData.get("qty") || "1"), 10) || 1);
  if (!slug) return;
  const items = await readCart();
  const existing = items.find((i) => i.slug === slug);
  if (existing) existing.qty += qty;
  else items.push({ slug, qty });
  await writeCart(items);
  revalidatePath("/", "layout");
  redirect("/cart");
}

export async function updateQuantity(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const qty = parseInt(String(formData.get("qty") || "0"), 10) || 0;
  if (!slug) return;
  const items = await readCart();
  if (qty <= 0) {
    await writeCart(items.filter((i) => i.slug !== slug));
  } else {
    const item = items.find((i) => i.slug === slug);
    if (item) item.qty = qty;
    else items.push({ slug, qty });
    await writeCart(items);
  }
  revalidatePath("/", "layout");
}

export async function removeFromCart(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  if (!slug) return;
  await writeCart((await readCart()).filter((i) => i.slug !== slug));
  revalidatePath("/", "layout");
}

export async function clearCart() {
  await writeCart([]);
  revalidatePath("/", "layout");
}

export async function submitOrder(formData: FormData) {
  const items = await readCart();
  if (items.length === 0) {
    redirect("/cart");
  }
  const orderNumber =
    "RRS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const name = String(formData.get("name") || "Friend").trim() || "Friend";
  const email = String(formData.get("email") || "").trim();
  (await cookies()).set(
    ORDER_COOKIE,
    JSON.stringify({ orderNumber, items, name, email, placedAt: Date.now() }),
    ORDER_OPTIONS
  );
  await writeCart([]);
  revalidatePath("/", "layout");
  redirect("/checkout/success");
}
