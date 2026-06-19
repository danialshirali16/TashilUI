/** Persian / RTL formatting helpers (foundations: Persian numerals, Rial, Jalali). */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert ASCII digits in a string/number to Persian digits (۰–۹). */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** Convert Persian (۰–۹) and Arabic-Indic (٠–٩) digits back to ASCII
 *  (e.g. for parsing user input). Non-digit characters are left untouched. */
export function toLatinDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)) // U+06F0–06F9 Persian
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)); // U+0660–0669 Arabic-Indic
}

/** The Rial currency symbol (﷼). */
export const RIAL = "﷼";

export interface FormatRialOptions {
  /** Use Persian numerals. Default true. */
  persianDigits?: boolean;
  /** Group thousands with a separator. Default true. */
  grouping?: boolean;
}

/**
 * Format an amount as Rial: grouped thousands, Persian numerals, trailing ﷼.
 * e.g. formatRial(2500000) → "۲٬۵۰۰٬۰۰۰ ﷼"
 */
export function formatRial(amount: number, options: FormatRialOptions = {}): string {
  const { persianDigits = true, grouping = true } = options;
  const abs = Math.abs(Math.trunc(amount));
  let digits = String(abs);
  if (grouping) digits = digits.replace(/\B(?=(\d{3})+(?!\d))/g, "٬"); // U+066C Arabic thousands sep
  const sign = amount < 0 ? "-" : "";
  const out = `${sign}${digits} ${RIAL}`;
  return persianDigits ? toPersianDigits(out) : out;
}
