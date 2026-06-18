import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { cx } from "../../lib/cx";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends ComponentPropsWithoutRef<typeof RadixCheckbox.Root> {
  /** Optional label rendered next to the box (inline-start). */
  label?: ReactNode;
  /** Error status — red border / fill (Figma `Status=Error`). */
  error?: boolean;
  /** Read-only — value is shown but not editable (Figma `Status=Read-Only`). */
  readOnly?: boolean;
}

/* 12px glyphs (Figma Check / Minus), drawn on a 12 viewBox. */
const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M10 3.5 4.75 9 2 6.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IndeterminateIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * Checkbox built on Radix (focus, keyboard, ARIA, indeterminate) + our CSS.
 * Matches the Swiss Army Figma: 16px box, 12px glyph, statuses
 * default / error / read-only / disabled, with idle/hover/pressed states.
 */
export const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(function Checkbox({ label, id, className, error, readOnly, ...rest }, ref) {
  const autoId = useId();
  const checkboxId = id ?? autoId;
  const box = (
    <RadixCheckbox.Root
      ref={ref}
      id={checkboxId}
      className={cx(styles.box, className)}
      data-error={error ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      aria-invalid={error || undefined}
      aria-readonly={readOnly || undefined}
      tabIndex={readOnly ? -1 : undefined}
      {...rest}
    >
      <RadixCheckbox.Indicator className={styles.indicator}>
        {rest.checked === "indeterminate" ? <IndeterminateIcon /> : <CheckIcon />}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );

  if (!label) return box;

  return (
    <span className={styles.wrapper} data-disabled={rest.disabled ? "" : undefined}>
      {box}
      <label className={styles.label} htmlFor={checkboxId}>
        {label}
      </label>
    </span>
  );
});
