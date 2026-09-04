// TODO: Replace hard-coded SHOP_ROOT_ID with an environment variable.
// Move tax rate (0.0825) and shipping threshold ($150 / $8.50 flat rate)
// to environment variables or a Sitecore settings item.

import { cookies } from "next/headers";
import { ImageField } from "@sitecore-content-sdk/nextjs";
import {
  sitecoreQuery,
  SITE_LANGUAGE,
  SitecoreImageField,
} from "src/lib/sitecore-graphql";

export const CART_COOKIE = "rrss_cart";
export const ORDER_COOKIE = "rrss_last_order";

// Shop folder item id — children of this item are the product page items, whose
// item `name` is the slug used in the cart cookie.
const SHOP_ROOT_ID = "A24054B9-1127-48AF-A58C-92DCFD4D40FC";

export interface CartEntry {
  slug: string;
  qty: number;
}

export interface CartProduct {
  name: string;
  price: number;
  category: string;
  tagline: string;
  productImage: ImageField;
}

export interface CartLineItem {
  slug: string;
  qty: number;
  product: CartProduct;
  lineTotal: number;
}

export interface CartTotals {
  lineItems: CartLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface LastOrder {
  orderNumber: string;
  items: CartEntry[];
  name: string;
  email: string;
  placedAt: number;
}

// --- product lookup (from Sitecore Edge) -----------------------------------

type ShopChildrenResult = {
  item?: {
    children?: {
      results?: Array<{
        name: string;
        template?: { name?: string };
        ProductName?: { value?: string } | null;
        Price?: { value?: string } | null;
        Category?: { value?: string } | null;
        Tagline?: { value?: string } | null;
        ProductImage?: { jsonValue?: SitecoreImageField } | null;
      }>;
    };
  } | null;
};

const SHOP_CHILDREN_QUERY = `
  query CartProducts($rootId: String!, $language: String!) {
    item(path: $rootId, language: $language) {
      children {
        results {
          name
          template { name }
          ProductName: field(name: "ProductName") { value }
          Price: field(name: "Price") { value }
          Category: field(name: "Category") { value }
          Tagline: field(name: "Tagline") { value }
          ProductImage: field(name: "ProductImage") { jsonValue }
        }
      }
    }
  }
`;

/**
 * Fetch all product page items once and return a slug -> product map.
 */
async function getProductMap(): Promise<Map<string, CartProduct>> {
  const data = await sitecoreQuery<ShopChildrenResult>(SHOP_CHILDREN_QUERY, {
    rootId: SHOP_ROOT_ID,
    language: SITE_LANGUAGE,
  });
  const results = data?.item?.children?.results ?? [];
  const map = new Map<string, CartProduct>();
  for (const r of results) {
    if (r.template?.name !== "Product Page") continue;
    map.set(r.name, {
      name: r.ProductName?.value ?? r.name,
      price: parseFloat(r.Price?.value ?? "0") || 0,
      category: r.Category?.value ?? "",
      tagline: r.Tagline?.value ?? "",
      productImage: (r.ProductImage?.jsonValue ?? { value: undefined }) as ImageField,
    });
  }
  return map;
}

// --- cookie helpers ---------------------------------------------------------

export async function readCartFromCookies(): Promise<CartEntry[]> {
  const c = (await cookies()).get(CART_COOKIE);
  if (!c) return [];
  try {
    const parsed = JSON.parse(c.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Used by Header — only needs the qty sum, no product lookup.
 */
export async function getCartItemCount(): Promise<number> {
  return (await readCartFromCookies()).reduce((sum, i) => sum + (i.qty || 0), 0);
}

export async function getCartLineItems(): Promise<CartLineItem[]> {
  const entries = await readCartFromCookies();
  if (entries.length === 0) return [];
  const products = await getProductMap();
  return entries
    .map((entry): CartLineItem | null => {
      const product = products.get(entry.slug);
      if (!product) return null;
      const qty = Math.max(1, parseInt(entry.qty as unknown as string, 10) || 1);
      return {
        slug: entry.slug,
        qty,
        product,
        lineTotal: product.price * qty,
      };
    })
    .filter((li): li is CartLineItem => Boolean(li));
}

export async function getCartSubtotal(): Promise<number> {
  return (await getCartLineItems()).reduce((sum, li) => sum + li.lineTotal, 0);
}

export function getShippingEstimate(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= 150 ? 0 : 8.5;
}

export async function getCartTotals(): Promise<CartTotals> {
  const lineItems = await getCartLineItems();
  const subtotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
  const shipping = getShippingEstimate(subtotal);
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;
  return { lineItems, subtotal, shipping, tax, total };
}

export interface OrderLineItem {
  slug: string;
  qty: number;
  product: CartProduct;
}

export interface ResolvedLastOrder extends LastOrder {
  resolvedItems: OrderLineItem[];
}

export async function readLastOrder(): Promise<ResolvedLastOrder | null> {
  const c = (await cookies()).get(ORDER_COOKIE);
  if (!c) return null;
  let order: LastOrder;
  try {
    order = JSON.parse(c.value);
  } catch {
    return null;
  }
  const products = await getProductMap();
  const resolvedItems: OrderLineItem[] = (order.items || [])
    .map((entry): OrderLineItem | null => {
      const product = products.get(entry.slug);
      if (!product) return null;
      return { slug: entry.slug, qty: entry.qty, product };
    })
    .filter((it): it is OrderLineItem => it !== null);
  return { ...order, resolvedItems };
}
