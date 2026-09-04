import { LinkField } from '@sitecore-content-sdk/nextjs';

/**
 * Strip `locale: false` from a LinkField value.
 * The Layout Service returns `locale: false` on link fields, but React rejects
 * a boolean value for the non-boolean HTML attribute `locale`.
 */
export const sanitizeLink = (field: LinkField | undefined): LinkField | undefined => {
  if (!field?.value) return field;
  const { locale, ...rest } = field.value as Record<string, unknown>;
  return {
    ...field,
    value: { ...rest, ...(locale != null && locale !== false ? { locale } : {}) },
  };
};
