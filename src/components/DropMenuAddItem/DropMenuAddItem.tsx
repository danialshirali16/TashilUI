import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { IconPlus } from "../../icons";
import styles from "./DropMenuAddItem.module.css";

export interface DropMenuAddItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Label. @default «افزودن چیز جدید» */
  children?: ReactNode;
}

/**
 * DropMenuAddItem — the Swiss Army `Dropmenu/base/addNewItem` footer action. An atomic building
 * block for the future dropdown / select / combobox Input components (not a standalone control).
 * Pure CSS, semantic tokens, RTL-correct (label inline-start, ＋ inline-end).
 */
export const DropMenuAddItem = forwardRef<HTMLButtonElement, DropMenuAddItemProps>(
  function DropMenuAddItem({ children = "افزودن چیز جدید", className, ...rest }, ref) {
    return (
      <button ref={ref} type="button" className={cx(styles.root, className)} {...rest}>
        <span className={styles.icon}>
          <IconPlus />
        </span>
        <span className={styles.label}>{children}</span>
      </button>
    );
  },
);
