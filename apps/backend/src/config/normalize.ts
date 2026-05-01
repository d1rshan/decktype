export const normalizeUrlOrigin = (value: string) =>
  value.trim().toLowerCase().replace(/\/+$/, "");
