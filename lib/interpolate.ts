export function interpolate(
  template: string,
  params: Record<string, string | number | boolean>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined || value === null) return `{{${key}}}`;
    return String(value);
  });
}
