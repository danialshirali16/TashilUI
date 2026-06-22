import { Children, createContext, forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { cx } from "../../lib/cx";
import { RadioButton } from "../RadioButton";
import styles from "./Menu.module.css";

/** True when a MenuItem is rendered inside an interactive `Menu` (Radix DropdownMenu). */
export const MenuContext = createContext(false);

export interface MenuProps {
  /** The element that opens the menu (button, icon, …). */
  trigger: ReactNode;
  /** Menu content — typically `MenuSection`s (dividers are inserted between them). */
  children?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Open-state change. */
  onOpenChange?: (open: boolean) => void;
  /** Side of the trigger to render on. @default "bottom" */
  side?: "top" | "right" | "bottom" | "left";
  /** Alignment relative to the trigger. @default "start" */
  align?: "start" | "center" | "end";
  className?: string;
}

/**
 * Menu — the interactive Swiss Army action menu. A Radix DropdownMenu (trigger, focus, keyboard
 * nav, type-ahead, Esc / click-outside) wrapping the elevated `Menu` surface. Compose it from
 * `MenuSection`s of `MenuItem`s; dividers are inserted automatically between sections. RTL-first,
 * semantic tokens only.
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { trigger, children, open, defaultOpen, onOpenChange, side = "bottom", align = "start", className },
  ref,
) {
  // Insert a divider between each top-level section.
  const sections = Children.toArray(children).filter(Boolean);
  const withDividers = sections.flatMap((child, i) =>
    i === 0 ? [child] : [<MenuSeparator key={`sep-${i}`} />, child],
  );

  return (
    <DropdownMenu.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      dir="rtl"
    >
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={4}
          className={cx(styles.root, className)}
        >
          <MenuContext.Provider value>{withDividers}</MenuContext.Provider>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});

/** A group of menu rows. Dividers are placed between sections by the parent `Menu`. */
export const MenuSection = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function MenuSection({ children, className, ...rest }, ref) {
    return (
      <DropdownMenu.Group ref={ref} className={cx(styles.section, className)} {...rest}>
        {children}
      </DropdownMenu.Group>
    );
  },
);

/** A full-width divider between menu sections. */
export const MenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function MenuSeparator({ className, ...rest }, ref) {
    return (
      <DropdownMenu.Separator ref={ref} className={cx(styles.separator, className)} {...rest} />
    );
  },
);

export interface MenuRadioGroupProps {
  /** Selected value (controlled). */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Selection change. */
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
}

/**
 * A single-select radio group inside a Menu. Provides the Radix radio context for `MenuRadioItem`s
 * (which reuse our `RadioButton`) while laying them out flush as full-width menu rows.
 */
export const MenuRadioGroup = forwardRef<HTMLDivElement, MenuRadioGroupProps>(
  function MenuRadioGroup({ value, defaultValue, onValueChange, children, className }, ref) {
    return (
      <RadixRadioGroup.Root
        ref={ref}
        dir="rtl"
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        className={cx(styles.radioGroup, className)}
      >
        {children}
      </RadixRadioGroup.Root>
    );
  },
);

export interface MenuRadioItemProps {
  /** Value selected when this row is chosen. */
  value: string;
  children?: ReactNode;
  disabled?: boolean;
}

/** A menu row that selects a radio value — reuses `RadioButton` with full menu-row padding. */
export const MenuRadioItem = forwardRef<HTMLDivElement, MenuRadioItemProps>(
  function MenuRadioItem({ value, children, disabled }, ref) {
    const id = useId();
    return (
      <div ref={ref} className={styles.radioRow} data-disabled={disabled || undefined}>
        <RadioButton value={value} id={id} disabled={disabled} />
        <label htmlFor={id} className={styles.radioLabel}>
          {children}
        </label>
      </div>
    );
  },
);
