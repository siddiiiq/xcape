import slugifyLib from "slugify";

export const toSlug = (text) =>
  slugifyLib(text, { lower: true, strict: true, trim: true });

export default toSlug;
