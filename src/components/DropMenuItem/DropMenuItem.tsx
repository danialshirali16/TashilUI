import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { IconCheck } from "../../icons";
import styles from "./DropMenuItem.module.css";

export type DropMenuItemSize = "sm" | "md";
/** Figma "Type" axis — the trailing accessory at the inline-start. */
export type DropMenuItemAccessory = "none" | "icon" | "checkbox";

export interface DropMenuItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Primary label. */
  children?: ReactNode;
  /** Secondary caption under the label (Figma «توضیحات»). */
  description?: ReactNode;
  /** Row size — sm (10px block padding) or md (14px). @default "md" */
  size?: DropMenuItemSize;
  /** Accessory kind (Figma Type: Simple/Icon/Checkbox). @default "none" */
  accessory?: DropMenuItemAccessory;
  /** Leading icon for the `icon` accessory (swapped for a ✓ when selected). */
  icon?: ReactNode;
  /** Selected state (Figma Status=Selected) — checks the box / shows the ✓. */
  selected?: boolean;
  /** Disabled state (Figma Status=Disable). */
  disabled?: boolean;
}

/**
 * DropMenuItem — the Swiss Army `Dropmenu/base/List` row. An atomic building block for the
 * future dropdown / select / combobox Input components (not a standalone control). Pure CSS,
 * semantic tokens, RTL-correct (accessory at the inline-start / right, label fills toward the
 * inline-end / left). Hover is CSS-driven.
 */
export const DropMenuItem = forwardRef<HTMLButtonElement, DropMenuItemProps>(
  function DropMenuItem(
    {
      children,
      description,
      size = "md",
      accessory = "none",
      icon,
      selected = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={accessory === "none" ? undefined : selected}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-size={size}
        data-selected={selected || undefined}
        data-disabled={disabled || undefined}
        className={cx(styles.root, className)}
        {...rest}
      >
        {accessory === "checkbox" && (
          <span className={styles.holder}>
            <span className={styles.checkbox} data-checked={selected || undefined}>
              {selected && (
                <span className={styles.checkGlyph}>
                  <IconCheck />
                </span>
              )}
            </span>
          </span>
        )}

        {accessory === "icon" && (
          <span className={styles.holder}>
            {selected ? (
              <span className={cx(styles.icon, styles.iconSelected)}>
                <IconCheck />
              </span>
            ) : (
              <span className={styles.icon} aria-hidden="true">
                {icon}
              </span>
            )}
          </span>
        )}

        <span className={styles.content}>
          <span className={styles.label}>{children}</span>
          {description != null && <span className={styles.description}>{description}</span>}
        </span>
      </button>
    );
  },
);
