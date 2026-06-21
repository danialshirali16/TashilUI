import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { InputChip } from "../InputChip";
import styles from "./InputChips.module.css";

export interface InputChipsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Overflow count. When greater than 0, a trailing «{overflow}+» limited chip is
   * rendered after the children (sits inline-end — visually leftmost in RTL).
   */
  overflow?: number;
  /** Dim the trailing overflow indicator. */
  disabled?: boolean;
}

/**
 * InputChips — the Swiss Army `Inputs/elements/Chips` row. Lays out `InputChip`s with the
 * design's 2px gap and an optional «+N» overflow indicator. An internal layout atom for the
 * chips / multi-select Input components (not a standalone control).
 */
export const InputChips = forwardRef<HTMLDivElement, InputChipsProps>(function InputChips(
  { overflow = 0, disabled = false, children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(styles.root, className)} {...rest}>
      {children}
      {overflow > 0 && <InputChip variant="limited" count={overflow} disabled={disabled} />}
    </div>
  );
});
