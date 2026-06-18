import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { cx } from "../../lib/cx";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends ComponentPropsWithoutRef<typeof RadixCheckbox.Root> {
  /** Optional label rendered next to the box. */
  label?: ReactNode;
}

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M11.5 3.5L5.5 10L2.5 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IndeterminateIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Checkbox built on Radix (focus, keyboard, ARIA, indeterminate) + our CSS. */
export const Checkbox = forwardRef<
  ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(function Checkbox({ label, id, className, ...rest }, ref) {
  const autoId = useId();
  const checkboxId = id ?? autoId;
  const box = (
    <RadixCheckbox.Root
      ref={ref}
      id={checkboxId}
      className={cx(styles.box, className)}
      {...rest}
    >
      <RadixCheckbox.Indicator className={styles.indicator}>
        {rest.checked === "indeterminate" ? <IndeterminateIcon /> : <CheckIcon />}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );

  if (!label) return box;

  return (
    <span className={styles.wrapper}>
      {box}
      <label className={styles.label} htmlFor={checkboxId}>
        {label}
      </label>
    </span>
  );
});
