/** SXA rendering params merged onto mapped Angular components. */
export type SxaParams = { [key: string]: string };

export function sxaStyles(params: SxaParams | undefined): string {
  return (params?.Styles || params?.styles || '').trim();
}

export function sxaComponentClass(base: string, params: SxaParams | undefined): string {
  return `${base} ${sxaStyles(params)}`.trim();
}

export function sxaRenderingId(params: SxaParams | undefined): string | undefined {
  const id = params?.RenderingIdentifier?.trim();
  return id || undefined;
}
