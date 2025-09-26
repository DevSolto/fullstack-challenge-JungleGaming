export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const isNonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
