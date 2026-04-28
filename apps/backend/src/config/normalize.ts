export const normalizeUrlOrigin = (value: string) =>
  value.trim().toLowerCase().replace(/\/+$/, "");

export const parseCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
