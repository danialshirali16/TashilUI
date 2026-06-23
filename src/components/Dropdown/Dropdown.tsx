import { forwardRef, useId, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { IconChevronDown, IconClose } from "../../icons";
import { DropMenu } from "../DropMenu";
import type { DropMenuOption } from "../DropMenu";
import { InputChip } from "../InputChip";
import { InputChips } from "../InputChips";
import styles from "./Dropdown.module.css";

export type DropdownOption = DropMenuOption;

export interface DropdownProps {
  /** Floating label (Figma «تیتر اینپوت»). */
  label?: ReactNode;
  /** Placeholder shown while open and empty (Figma «انتخاب کنید»). */
  placeholder?: string;
  /** The selectable options. */
  items: DropMenuOption[];
  /** Selected value(s). Controlled. */
  value?: string | string[];
  /** Uncontrolled initial value(s). */
  defaultValue?: string | string[];
  /** Selection change — a string in single mode, string[] in multiple. */
  onValueChange?: (value: string | string[]) => void;
  /** Allow multiple selection (renders removable chips). */
  multiple?: boolean;
  /** Show a search field inside the menu. */
  searchable?: boolean;
  /** Show a clear ✕ that empties the selection while it has a value. */
  clearable?: boolean;
  /** Helper text below the field. */
  helperText?: ReactNode;
  /** Error message — renders the field in its error state (overrides helperText). */
  error?: ReactNode;
  /** Disabled state. */
  disabled?: boolean;
  /** Append «(اختیاری)» to the label. */
  optional?: boolean;
  /** Trailing «افزودن چیز جدید» footer in the menu. */
  addNewLabel?: ReactNode;
  /** Add-new footer handler. */
  onAddNew?: () => void;
  /** Cap the number of chips shown (multiple); the rest collapse into «+N». */
  maxVisibleChips?: number;
}

const asArray = (v: string | string[] | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v : v ? [v] : [];

/**
 * Dropdown — the Swiss Army select field. A floating-label control (placeholder / single value /
 * removable chips + chevron) that opens a `DropMenu` for selection, with helper/error messages and
 * idle / hover / focus-open / error / disabled states. Single or multiple select, optional search,
 * clear, and add-new. RTL-first, semantic tokens only.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  {
    label,
    placeholder = "انتخاب کنید",
    items,
    value,
    defaultValue,
    onValueChange,
    multiple = false,
    searchable = false,
    clearable = false,
    helperText,
    error,
    disabled = false,
    optional = false,
    addNewLabel,
    onAddNew,
    maxVisibleChips,
  },
  ref,
) {
  const labelId = useId();
  const messageId = useId();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue ?? (multiple ? [] : ""),
  );
  const selected = value ?? internalValue;
  const selectedArr = asArray(selected);
  const hasValue = selectedArr.length > 0;
  const hasError = Boolean(error);
  const message = error ?? helperText;

  const setValue = (next: string | string[]) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const labelOf = (v: string) => items.find((o) => o.value === v)?.label ?? v;
  const floated = open || hasValue;

  const removeChip = (v: string) => setValue(selectedArr.filter((x) => x !== v));
  const clear = () => setValue(multiple ? [] : "");

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  // Chip overflow (multiple)
  const visible =
    maxVisibleChips != null ? selectedArr.slice(0, maxVisibleChips) : selectedArr;
  const overflow = selectedArr.length - visible.length;

  const valueArea = (
    <span className={styles.valueArea}>
      {hasValue ? (
        multiple ? (
          <InputChips overflow={overflow > 0 ? overflow : undefined}>
            {visible.map((v) => (
              <InputChip
                key={v}
                disabled={disabled}
                onRemove={() => removeChip(v)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {labelOf(v)}
              </InputChip>
            ))}
          </InputChips>
        ) : (
          <span className={styles.single}>{labelOf(selectedArr[0])}</span>
        )
      ) : (
        open && <span className={styles.placeholder}>{placeholder}</span>
      )}
    </span>
  );

  const control = (
    <div
      ref={ref}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-labelledby={label != null ? labelId : undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={message != null ? messageId : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      data-floated={floated || undefined}
      data-disabled={disabled || undefined}
      className={styles.control}
      onKeyDown={onKeyDown}
    >
      {valueArea}
      {label != null && (
        <span id={labelId} className={styles.label}>
          {label}
          {optional && <span className={styles.optionalTag}>(اختیاری)</span>}
        </span>
      )}
      {clearable && hasValue && !disabled && (
        <button
          type="button"
          className={styles.clear}
          aria-label="پاک کردن"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            clear();
          }}
        >
          <IconClose />
        </button>
      )}
      <span className={styles.chevron} aria-hidden="true">
        <IconChevronDown />
      </span>
    </div>
  );

  return (
    <div
      className={styles.field}
      data-status={hasError ? "error" : undefined}
      data-disabled={disabled || undefined}
    >
      {disabled ? (
        control
      ) : (
        <DropMenu
          open={open}
          onOpenChange={setOpen}
          items={items}
          value={selected}
          onValueChange={setValue}
          multiple={multiple}
          searchable={searchable}
          addNewLabel={addNewLabel}
          onAddNew={onAddNew}
          matchTriggerWidth
          trigger={control}
        />
      )}
      {message != null && (
        <p id={messageId} className={styles.message}>
          {message}
        </p>
      )}
    </div>
  );
});
