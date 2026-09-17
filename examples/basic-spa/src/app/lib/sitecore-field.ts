/** Read a Sitecore field value without assuming jsonValue vs value shape. */
export function sitecoreFieldValue(field: unknown): string {
  if (field == null) {
    return '';
  }
  if (typeof field === 'string' || typeof field === 'number') {
    return String(field);
  }
  if (typeof field === 'object' && 'value' in field) {
    const value = (field as { value: unknown }).value;
    if (value == null) {
      return '';
    }
    return String(value);
  }
  return '';
}

export function parseJsonArray<T>(raw: string): T[] {
  const text = raw.trim();
  if (!text) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(text);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * A Sitecore item reached through a Multilist / Droplink field. The layout service
 * expands those fields into the linked items themselves, so components can read real
 * content (and a real `url`) without a second GraphQL round trip.
 */
export interface LinkedItem {
  id: string;
  url?: string;
  name?: string;
  displayName?: string;
  fields?: Record<string, unknown>;
}

/** Normalise a Multilist field into its linked items; tolerant of the empty/absent case. */
export function linkedItems(field: unknown): LinkedItem[] {
  if (Array.isArray(field)) {
    return field as LinkedItem[];
  }
  if (field && typeof field === 'object') {
    const inner = (field as { value?: unknown }).value;
    if (Array.isArray(inner)) {
      return inner as LinkedItem[];
    }
  }
  return [];
}

/** Read a named field off a linked item. */
export function itemField(item: LinkedItem | undefined, name: string): string {
  return sitecoreFieldValue(item?.fields?.[name]);
}

/**
 * Label for a Droplink target. Taxonomy items expose an explicit `Label` field; fall
 * back to the item's display name so a half-authored taxonomy still renders something.
 */
export function linkedLabel(field: unknown): string {
  if (field && typeof field === 'object') {
    const item = ((field as { value?: unknown }).value ?? field) as LinkedItem;
    const label = sitecoreFieldValue(item.fields?.['Label']);
    if (label) {
      return label;
    }
    return item.displayName ?? item.name ?? '';
  }
  return sitecoreFieldValue(field);
}
