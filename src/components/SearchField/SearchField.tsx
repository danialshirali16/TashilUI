import { forwardRef, useCallback, useRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent } from "react";
import { cx } from "../../lib/cx";
import { IconMagnifier, IconClose } from "../../icons";
import styles from "./SearchField.module.css";

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Show a built-in clear (✕) at the inline-end while the field has a value
   *  (hidden while focused, disabled, or read-only). @default true */
  clearable?: boolean;
  /** Called when the built-in clear button empties the field. */
  onClear?: () => void;
  /** Called with the current value when the user presses Enter. */
  onSearch?: (value: string) => void;
  /** Show the «Enter ↵» hint chip while the field is focused. @default true */
  enterHint?: boolean;
  /** Optional placeholder shown while the field is focused and empty. By default the
   *  resting placeholder is kept (no swap); pass a string to override it on focus. @default null */
  focusPlaceholder?: string | null;
}

/**
 * SearchField — the Swiss Army `SearchField`: a 40px search input with a leading magnifier
 * (inline-start), a clear ✕ that appears once the field has a value, and an «Enter ↵» hint chip
 * shown while focused. Rest / hover / focus states are CSS-driven. Pure CSS, semantic tokens,
 * RTL-first. The caret is the brand primary colour.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    clearable = true,
    onClear,
    onSearch,
    enterHint = true,
    focusPlaceholder = null,
    disabled,
    readOnly,
    placeholder = "جستجو…",
    value,
    defaultValue,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    className,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const innerRef = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  const isControlled = value !== undefined;
  const [uncontrolledHasValue, setUncontrolledHasValue] = useState(
    () => defaultValue != null && String(defaultValue) !== "",
  );
  const hasValue = isControlled ? value != null && value !== "" : uncontrolledHasValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledHasValue(event.target.value !== "");
    onChange?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") onSearch?.(event.currentTarget.value);
    onKeyDown?.(event);
  };

  const handleClear = () => {
    const el = innerRef.current;
    if (el) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.focus();
    }
    if (!isControlled) setUncontrolledHasValue(false);
    onClear?.();
  };

  const showClear = clearable && hasValue && !disabled && !readOnly;

  return (
    <div
      className={cx(styles.field, className)}
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
    >
      <span className={styles.searchIcon} aria-hidden="true">
        <IconMagnifier />
      </span>
      <input
        ref={setRef}
        type="search"
        className={styles.input}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={focused && focusPlaceholder != null ? focusPlaceholder : placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {enterHint && (
        <span className={styles.enterHint} aria-hidden="true">
          Enter ↵
        </span>
      )}
      {showClear && (
        <button
          type="button"
          className={styles.clear}
          aria-label="پاک کردن"
          onClick={handleClear}
        >
          <IconClose />
        </button>
      )}
    </div>
  );
});
