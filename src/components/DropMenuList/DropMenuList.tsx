import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import styles from "./DropMenuList.module.css";

export interface DropMenuListProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple selected items (sets `aria-multiselectable`). */
  multiselectable?: boolean;
}

/**
 * DropMenuList — the Swiss Army `Dropmenu/element/List`: a vertical `role="listbox"` stack of
 * `DropMenuItem`s. An atomic building block for the future dropdown / select / combobox Input
 * components (not a standalone control).
 */
export const DropMenuList = forwardRef<HTMLDivElement, DropMenuListProps>(function DropMenuList(
  { multiselectable, children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="listbox"
      aria-multiselectable={multiselectable || undefined}
      className={cx(styles.root, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
