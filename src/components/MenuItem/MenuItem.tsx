import { forwardRef, useContext } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cx } from "../../lib/cx";
import { IconCheck } from "../../icons";
import { Checkbox } from "../Checkbox";
import { MenuContext } from "../Menu/Menu";
import styles from "./MenuItem.module.css";

/** Figma "Type" axis — intent + accessory kind. Radio items use `RadioButton` + `RadioGroup`. */
export type MenuItemType = "default" | "destructive" | "no-icon" | "checkbox";
/** Figma "Height" axis — row block padding. */
export type MenuItemHeight = "low" | "high";

export interface MenuItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onSelect"> {
  /** Primary label. */
  children?: ReactNode;
  /** Secondary caption under the label (Figma «توضیحات»). */
  description?: ReactNode;
  /**
   * Item kind (Figma Type):
   * - `default` — neutral action with an optional leading `icon`.
   * - `destructive` — red action with an optional leading `icon`.
   * - `no-icon` — text-only; a ✓ shows when `selected`.
   * - `checkbox` — a multi-select control reflecting `selected`.
   * @default "default"
   */
  type?: MenuItemType;
  /** Leading icon (default / destructive types). */
  icon?: ReactNode;
  /** Selected state — shows the ✓ (no-icon) or checks the box (checkbox). */
  selected?: boolean;
  /** Row block padding — low (10px) or high (14px). @default "low" */
  height?: MenuItemHeight;
  /** Disabled state. */
  disabled?: boolean;
  /** Fired when the item is chosen (click / Enter) inside an interactive `Menu`. */
  onSelect?: (event: Event) => void;
  /** Fired when a `checkbox` item toggles inside an interactive `Menu`. */
  onCheckedChange?: (checked: boolean) => void;
}

const ROLE = {
  default: "menuitem",
  destructive: "menuitem",
  "no-icon": "menuitem",
  checkbox: "menuitemcheckbox",
} as const;

/**
 * MenuItem — the Swiss Army `Menu/base/items` row. Renders a plain styled button on its own
 * (Base Components), and integrates with Radix DropdownMenu automatically when placed inside an
 * interactive `Menu` (keyboard nav, type-ahead, selection). Pure CSS, semantic tokens,
 * RTL-correct (accessory at the inline-start, label fills toward the inline-end).
 */
export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  {
    children,
    description,
    type = "default",
    icon,
    selected = false,
    height = "low",
    disabled = false,
    onSelect,
    onCheckedChange,
    className,
    ...rest
  },
  ref,
) {
  const inMenu = useContext(MenuContext);

  const inner = (
    <button
      ref={ref}
      type="button"
      role={ROLE[type]}
      aria-checked={type === "checkbox" ? selected : undefined}
      aria-disabled={disabled || undefined}
      data-type={type}
      data-height={height}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      className={cx(styles.root, className)}
      {...(inMenu ? {} : { disabled, ...rest })}
    >
      <span className={styles.header}>
        {(type === "default" || type === "destructive") && icon != null && (
          <span className={styles.accessory} aria-hidden="true">
            {icon}
          </span>
        )}
        {type === "no-icon" && selected && (
          <span className={cx(styles.accessory, styles.accessoryPrimary)} aria-hidden="true">
            <IconCheck />
          </span>
        )}
        {type === "checkbox" && (
          <span className={styles.accessory}>
            <Checkbox
              checked={selected}
              disabled={disabled}
              tabIndex={-1}
              aria-hidden
              style={{ pointerEvents: "none" }}
            />
          </span>
        )}
        <span className={styles.label}>{children}</span>
      </span>
      {description != null && <span className={styles.description}>{description}</span>}
    </button>
  );

  if (!inMenu) return inner;

  if (type === "checkbox") {
    return (
      <DropdownMenu.CheckboxItem
        asChild
        checked={selected}
        onCheckedChange={onCheckedChange}
        onSelect={(e) => e.preventDefault()} // keep the menu open while toggling
        disabled={disabled}
      >
        {inner}
      </DropdownMenu.CheckboxItem>
    );
  }

  return (
    <DropdownMenu.Item asChild onSelect={onSelect} disabled={disabled}>
      {inner}
    </DropdownMenu.Item>
  );
});
