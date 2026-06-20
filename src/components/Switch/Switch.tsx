import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { cx } from "../../lib/cx";
import styles from "./Switch.module.css";

export interface SwitchProps
  extends ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  /** Optional label rendered next to the toggle (inline-start). */
  label?: ReactNode;
  /** Read-only — shows the value but can't be toggled (Figma `Status=Read-Only`).
   *  Kept full-colour (not faded like disabled) but inert. */
  readOnly?: boolean;
}

/**
 * A toggle switch built on Radix Switch (focus, keyboard, ARIA) + our CSS.
 * Matches the Swiss Army Figma: 36×20 pill, 12px thumb, off = grey thumb on a
 * white track, on = white thumb on a primary track. RTL-aware (the thumb travels
 * via logical `inset-inline-start`).
 */
export const Switch = forwardRef<
  ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(function Switch({ label, id, className, disabled, readOnly, ...rest }, ref) {
  const autoId = useId();
  const switchId = id ?? autoId;

  const control = (
    <RadixSwitch.Root
      ref={ref}
      id={switchId}
      className={cx(styles.switch, className)}
      // Radix Switch has no read-only; make it inert via `disabled` while keeping
      // its full-colour look via data-readonly (the faded disabled style is
      // scoped to :not([data-readonly])).
      disabled={disabled || readOnly}
      data-readonly={readOnly ? "" : undefined}
      aria-readonly={readOnly || undefined}
      {...rest}
    >
      <RadixSwitch.Thumb className={styles.thumb} />
    </RadixSwitch.Root>
  );

  if (!label) return control;

  return (
    <span className={styles.wrapper} data-disabled={disabled ? "" : undefined}>
      {control}
      <label className={styles.label} htmlFor={switchId}>
        {label}
      </label>
    </span>
  );
});
