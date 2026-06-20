import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { cx } from "../../lib/cx";
import styles from "./RadioButton.module.css";

export interface RadioButtonProps
  extends ComponentPropsWithoutRef<typeof RadixRadioGroup.Item> {
  /** Optional label rendered next to the ring (inline-start). */
  label?: ReactNode;
  /** Error status — red ring / fill (Figma `Status=Error`). */
  error?: boolean;
  /** Read-only — value is shown but not editable (Figma `Status=Read-Only`). */
  readOnly?: boolean;
  /** Show «(اختیاری)» after the label, styled like the label. */
  optional?: boolean;
}

/**
 * A single radio option built on Radix RadioGroup (focus, keyboard, ARIA) + our
 * CSS. Matches the Swiss Army Figma: 18px ring, 8px dot, statuses default /
 * error / read-only / disabled. **Must be rendered inside a `RadioGroup`** —
 * radios are inherently grouped, and Radix provides the selection context.
 */
export const RadioButton = forwardRef<
  ElementRef<typeof RadixRadioGroup.Item>,
  RadioButtonProps
>(function RadioButton(
  { label, id, className, error, readOnly, disabled, optional, ...rest },
  ref,
) {
  const autoId = useId();
  const radioId = id ?? autoId;
  const control = (
    <RadixRadioGroup.Item
      ref={ref}
      id={radioId}
      className={cx(styles.radio, className)}
      // Native radios ignore `readonly`, and a label click toggles via htmlFor
      // regardless of CSS pointer-events — so make read-only genuinely inert
      // (like disabled) while keeping its read-only styling via data-readonly.
      disabled={disabled || readOnly}
      data-error={error ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      aria-invalid={error || undefined}
      aria-readonly={readOnly || undefined}
      {...rest}
    >
      <RadixRadioGroup.Indicator className={styles.indicator} />
    </RadixRadioGroup.Item>
  );

  if (!label) return control;

  return (
    <span className={styles.wrapper} data-disabled={disabled ? "" : undefined}>
      {control}
      <label className={styles.label} htmlFor={radioId}>
        {label}
        {optional && <span className={styles.optionalTag}>(اختیاری)</span>}
      </label>
    </span>
  );
});
