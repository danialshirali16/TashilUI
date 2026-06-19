/* Numeric input helpers shared by the Text Input components (TextField,
 * TextFieldSmall). Handles the digit normalization and the custom `currency`
 * input mode (thousands grouping). */

import type { InputHTMLAttributes } from "react";
import { toLatinDigits } from "./persian";

/** `inputMode` accepted by Text Inputs — the native values plus our custom
 *  `"currency"`, which groups the entered number into thousands (integers
 *  only). On the DOM, `"currency"` is rendered as `inputMode="numeric"`. */
export type TextInputMode =
  | NonNullable<InputHTMLAttributes<HTMLInputElement>["inputMode"]>
  | "currency";

/** U+066C Arabic thousands separator — same separator used by `formatRial`. */
export const THOUSANDS_SEPARATOR = "٬";

/** Group a value into thousands: normalizes digits to ASCII, drops everything
 *  that is not a digit (so no decimal point), then inserts a separator every
 *  three digits. e.g. "۲۵۰۰۰۰۰" → "2٬500٬000". */
export function groupThousands(value: string): string {
  const digits = toLatinDigits(value).replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
}

/** True when the (possibly custom) mode means the field holds a number. */
export function isNumericMode(
  mode: TextInputMode | undefined,
  type: string | undefined,
): boolean {
  return (
    type === "number" ||
    mode === "numeric" ||
    mode === "decimal" ||
    mode === "currency"
  );
}

/** The value rendered to the DOM `inputMode` attribute — `"currency"` is not a
 *  valid native value, so it maps to `"numeric"`. */
export function domInputMode(
  mode: TextInputMode | undefined,
): InputHTMLAttributes<HTMLInputElement>["inputMode"] {
  return mode === "currency" ? "numeric" : mode;
}

/** Normalize a value per the mode: `currency` groups thousands; every other
 *  numeric mode just converts Persian/Arabic-Indic digits to ASCII. */
export function normalizeNumericValue(
  value: string,
  mode: TextInputMode | undefined,
): string {
  return mode === "currency" ? groupThousands(value) : toLatinDigits(value);
}

/** Rewrite an input element's value in place per the mode, preserving the caret
 *  by digit count (so it stays correct even when grouping changes the length). */
export function applyNumericFormat(
  el: HTMLInputElement,
  mode: TextInputMode | undefined,
): void {
  const formatted = normalizeNumericValue(el.value, mode);
  if (formatted === el.value) return;

  const caret = el.selectionStart ?? el.value.length;
  const digitsBeforeCaret = toLatinDigits(el.value.slice(0, caret)).replace(
    /\D/g,
    "",
  ).length;

  el.value = formatted;

  // place the caret after the same number of digits in the reformatted value
  let pos = 0;
  let seen = 0;
  while (pos < formatted.length && seen < digitsBeforeCaret) {
    if (formatted.charCodeAt(pos) >= 48 && formatted.charCodeAt(pos) <= 57) {
      seen++;
    }
    pos++;
  }
  try {
    el.setSelectionRange(pos, pos);
  } catch {
    /* type="number" inputs don't support setSelectionRange */
  }
}
