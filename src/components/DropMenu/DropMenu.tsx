import { forwardRef, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import { cx } from "../../lib/cx";
import { SearchField } from "../SearchField";
import { DropMenuList } from "../DropMenuList";
import { DropMenuItem } from "../DropMenuItem";
import { DropMenuAddItem } from "../DropMenuAddItem";
import type { DropMenuItemSize } from "../DropMenuItem";
import styles from "./DropMenu.module.css";

export interface DropMenuOption {
  value: string;
  label: ReactNode;
  /** Plain-text form used for search filtering and type-ahead (defaults to `label` if a string). */
  searchText?: string;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropMenuProps {
  /** The element that opens the menu (button, field, …). */
  trigger: ReactNode;
  /** The selectable options. */
  items: DropMenuOption[];
  /** Selected value(s). Controlled. */
  value?: string | string[];
  /** Uncontrolled initial value(s). */
  defaultValue?: string | string[];
  /** Selection change. Receives a string in single mode, string[] in multiple. */
  onValueChange?: (value: string | string[]) => void;
  /** Allow selecting more than one item (checkbox rows; menu stays open). */
  multiple?: boolean;
  /** Row size. @default "md" */
  size?: DropMenuItemSize;
  /** Show the search field. @default false */
  searchable?: boolean;
  /** Search placeholder. @default «جستجو…» */
  searchPlaceholder?: string;
  /** Text shown when the filter matches nothing. @default «موردی یافت نشد» */
  emptyLabel?: ReactNode;
  /** Label for the trailing add-new footer; when set, the footer is rendered. */
  addNewLabel?: ReactNode;
  /** Add-new footer click handler. */
  onAddNew?: () => void;
  /** Controlled open state. */
  open?: boolean;
  /** Open-state change. */
  onOpenChange?: (open: boolean) => void;
  /** Side of the trigger to render on. @default "bottom" */
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

function optionText(o: DropMenuOption): string {
  if (o.searchText != null) return o.searchText;
  return typeof o.label === "string" ? o.label : "";
}

/**
 * DropMenu — the interactive Swiss Army dropdown menu. A Radix Popover hosts the
 * `DropMenu` surface (search field + scrollable `DropMenuList` of `DropMenuItem`s + optional
 * «افزودن چیز جدید» footer). Supports live search filtering, single/multiple selection, and
 * keyboard navigation (↑/↓/Home/End/Enter, Esc/click-outside to close). RTL-first, semantic
 * tokens only. The presentational atoms (`DropMenuItem`, `DropMenuList`, `DropMenuAddItem`)
 * remain available for custom composition.
 */
export const DropMenu = forwardRef<HTMLDivElement, DropMenuProps>(function DropMenu(
  {
    trigger,
    items,
    value,
    defaultValue,
    onValueChange,
    multiple = false,
    size = "md",
    searchable = false,
    searchPlaceholder = "جستجو…",
    emptyLabel = "موردی یافت نشد",
    addNewLabel,
    onAddNew,
    open,
    onOpenChange,
    side = "bottom",
    className,
  },
  ref,
) {
  const listId = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (open === undefined) setInternalOpen(next);
    if (!next) setQuery("");
  };

  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue ?? (multiple ? [] : ""),
  );
  const selected = value ?? internalValue;
  const selectedSet = useMemo(
    () => new Set(Array.isArray(selected) ? selected : selected ? [selected] : []),
    [selected],
  );

  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((o) => optionText(o).toLowerCase().includes(q));
  }, [items, query]);

  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const commit = (option: DropMenuOption) => {
    if (option.disabled) return;
    if (multiple) {
      const next = new Set(selectedSet);
      if (next.has(option.value)) next.delete(option.value);
      else next.add(option.value);
      const arr = [...next];
      if (value === undefined) setInternalValue(arr);
      onValueChange?.(arr);
    } else {
      if (value === undefined) setInternalValue(option.value);
      onValueChange?.(option.value);
      setOpen(false);
    }
  };

  const moveActive = (delta: number) => {
    if (filtered.length === 0) return;
    let next = active;
    for (let i = 0; i < filtered.length; i += 1) {
      next = (next + delta + filtered.length) % filtered.length;
      if (!filtered[next]?.disabled) break;
    }
    setActive(next);
    requestAnimationFrame(() => {
      const el = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]')[next];
      el?.scrollIntoView({ block: "nearest" });
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(filtered.length - 1);
        break;
      case "Enter":
        if (filtered[active]) {
          e.preventDefault();
          commit(filtered[active]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          ref={ref}
          side={side}
          align="start"
          sideOffset={4}
          dir="rtl"
          className={cx(styles.root, className)}
          onKeyDown={onKeyDown}
          onOpenAutoFocus={(e) => {
            // keep focus on the search field when present; otherwise let the list manage it
            if (!searchable) return;
            e.preventDefault();
            (
              (e.currentTarget as HTMLElement | null)?.querySelector(
                'input[type="search"]',
              ) as HTMLElement | null
            )?.focus();
          }}
        >
          {searchable && (
            <div className={styles.searchArea}>
              <SearchField
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onClear={() => {
                  setQuery("");
                  setActive(0);
                }}
                enterHint={false}
                focusPlaceholder={null}
                aria-controls={listId}
              />
            </div>
          )}

          <div className={styles.body} ref={listRef}>
            {filtered.length === 0 ? (
              <p className={styles.empty}>{emptyLabel}</p>
            ) : (
              <DropMenuList id={listId} multiselectable={multiple || undefined}>
                {filtered.map((o, i) => (
                  <DropMenuItem
                    key={o.value}
                    size={size}
                    accessory={multiple ? "checkbox" : o.icon ? "icon" : "none"}
                    icon={o.icon}
                    description={o.description}
                    selected={selectedSet.has(o.value)}
                    disabled={o.disabled}
                    data-active={i === active || undefined}
                    onPointerMove={() => setActive(i)}
                    onClick={() => commit(o)}
                  >
                    {o.label}
                  </DropMenuItem>
                ))}
              </DropMenuList>
            )}
          </div>

          {addNewLabel != null && (
            <DropMenuAddItem
              onClick={() => {
                onAddNew?.();
                setOpen(false);
              }}
            >
              {addNewLabel}
            </DropMenuAddItem>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});
