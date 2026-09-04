'use client';

import NextLink from 'next/link';
import {
  Link as EditableLink,
  type LinkField,
  type LinkFieldValue,
  type LinkProps as EditableLinkProps,
} from '@sitecore-content-sdk/react';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { sanitizeLink } from 'src/lib/link-utils';

const FILE_EXTENSION_MATCHER = /^\/.*\.\w+$/;
const DEFAULT_INTERNAL_LINK_MATCHER = /^\//;

type SitecoreLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  field?: EditableLinkProps['field'];
  editable?: boolean;
  showLinkTextWithChildrenPresent?: boolean;
  internalLinkMatcher?: RegExp;
};

const isLinkFieldValue = (field: LinkField | LinkFieldValue): field is LinkFieldValue =>
  'href' in field && !('value' in field);

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

const sanitizeField = (
  field: EditableLinkProps['field'] | undefined,
): EditableLinkProps['field'] | undefined => {
  if (!field) {
    return undefined;
  }

  if (isLinkFieldValue(field)) {
    const { locale, ...rest } = field as LinkFieldValue & { locale?: unknown };

    return {
      ...rest,
      ...(locale != null && locale !== false ? { locale } : {}),
    } as EditableLinkProps['field'];
  }

  return sanitizeLink(field as LinkField) as EditableLinkProps['field'];
};

const getLinkValue = (field: EditableLinkProps['field']): LinkFieldValue | undefined =>
  isLinkFieldValue(field) ? field : field.value;

const matchesInternalLink = (href: string, matcher: RegExp): boolean => {
  const safeMatcher = new RegExp(matcher.source, matcher.flags.replace(/g/g, ''));

  return safeMatcher.test(href);
};

const buildHref = (link: LinkFieldValue): string => {
  const querystring = asString(link.querystring) ? `?${link.querystring}` : '';
  const anchor = link.linktype !== 'anchor' && asString(link.anchor) ? `#${link.anchor}` : '';

  return `${link.href ?? ''}${querystring}${anchor}`;
};

const SitecoreLink = forwardRef<HTMLAnchorElement, SitecoreLinkProps>((props, ref) => {
  const {
    field,
    editable = true,
    children,
    className,
    title,
    target,
    rel,
    internalLinkMatcher = DEFAULT_INTERNAL_LINK_MATCHER,
    showLinkTextWithChildrenPresent,
    ...anchorProps
  } = props;

  const sanitizedField = sanitizeField(field);

  if (!sanitizedField) {
    return null;
  }

  const linkValue = getLinkValue(sanitizedField);
  const href = asString(linkValue?.href);
  const isEditing = Boolean(editable && 'metadata' in sanitizedField && sanitizedField.metadata);

  if (href && !isEditing && matchesInternalLink(href, internalLinkMatcher) && !FILE_EXTENSION_MATCHER.test(href)) {
    const resolvedTarget = target ?? asString(linkValue?.target);
    const resolvedRel = rel ?? (resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined);
    const linkText =
      showLinkTextWithChildrenPresent || !children ? asString(linkValue?.text) ?? href : null;

    return (
      <NextLink
        href={buildHref(linkValue as LinkFieldValue)}
        className={className ?? asString(linkValue?.class) ?? asString(linkValue?.className)}
        title={title ?? asString(linkValue?.title)}
        target={resolvedTarget}
        rel={resolvedRel}
        ref={ref}
        {...anchorProps}
      >
        {linkText}
        {children}
      </NextLink>
    );
  }

  if (!href && !isEditing) {
    return null;
  }

  return (
    <EditableLink
      field={sanitizedField}
      editable={editable}
      showLinkTextWithChildrenPresent={showLinkTextWithChildrenPresent}
      className={className}
      title={title}
      target={target}
      rel={rel}
      ref={ref}
      {...anchorProps}
    >
      {children}
    </EditableLink>
  );
});

SitecoreLink.displayName = 'SitecoreLink';

export default SitecoreLink;