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
