import { itemField, linkedItems, linkedLabel, type LinkedItem } from './sitecore-field';

/**
 * A park as the components consume it. Sourced entirely from Sitecore `Park` page items
 * reached through a Multilist field - there is no JSON blob and no hard-coded fallback.
 */
export interface Park {
  id: string;
  name: string;
  url: string;
  city: string;
  difficulty: string;
  features: string[];
  hours: string;
  capacity: number;
  summary: string;
}

/** Map a Multilist of Park page items onto {@link Park}. */
export function toParks(field: unknown): Park[] {
  return linkedItems(field).map(toPark);
}

function toPark(item: LinkedItem): Park {
  return {
    id: item.id,
    name: itemField(item, 'Title') || item.displayName || item.name || '',
    url: item.url ?? '',
    city: itemField(item, 'City'),
    difficulty: linkedLabel(item.fields?.['Difficulty']),
    features: linkedItems(item.fields?.['Features'])
      .map((feature) => linkedLabel(feature))
      .filter(Boolean),
    hours: itemField(item, 'Hours'),
    capacity: Number.parseInt(itemField(item, 'Capacity'), 10) || 0,
    summary: itemField(item, 'Summary'),
  };
}

/** A bookable lesson, sourced from `Lesson` items under the site's Data folder. */
export interface Lesson {
  id: string;
  title: string;
  level: string;
  duration: number;
  price: number;
  coach: string;
  summary: string;
}

export function toLessons(field: unknown): Lesson[] {
  return linkedItems(field).map((item) => ({
    id: item.id,
    title: itemField(item, 'Title') || item.displayName || item.name || '',
    level: linkedLabel(item.fields?.['Level']),
    duration: Number.parseInt(itemField(item, 'Duration'), 10) || 0,
    price: Number.parseInt(itemField(item, 'Price'), 10) || 0,
    coach: itemField(item, 'Coach'),
    summary: itemField(item, 'Summary'),
  }));
}
