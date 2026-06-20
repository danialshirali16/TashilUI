import { forwardRef, useCallback, useId, useRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import {
  applyNumericFormat,
  domInputMode,
  isNumericMode,
} from "../../lib/numericInput";
import type { TextInputMode } from "../../lib/numericInput";
import styles from "./TextFieldSmall.module.css";

/* 18px clear glyph (Figma trailing ✕), drawn on a 24 viewBox. */
const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path
      d="m6 6 12 12M18 6 6 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export interface TextFieldSmallProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "required" | "inputMode"
  > {
  /** Helper / description text shown below the field (Figma `message`). */
  helperText?: ReactNode;
  /** Error message — when set, the field renders in its error state. */
  error?: ReactNode;
  /** Unit adornment, e.g. ﷼ for amounts (Figma `unit`). Sits next to the input,
   *  bold and muted. */
  unit?: ReactNode;
  /** Leading icon at the inline-start (Figma `leadingIcon`), e.g. a type glyph. */
  leadingIcon?: ReactNode;
  /** Trailing content at the inline-end (Figma `trailingIcon`), e.g. a custom
   *  button. Rendered before the built-in clear button when both are present. */
  trailingAdornment?: ReactNode;
  /** Show a built-in clear (✕) button at the inline-end while the field has a
   *  value. Clicking it empties the field, focuses it, and fires `onChange`
   *  (with an empty value) and `onClear`. Hidden when disabled or read-only. */
  clearable?: boolean;
  /** Called when the built-in clear button empties the field. */
  onClear?: () => void;
  /** Mark the field as optional — when omitted/false (default) the field is
   *  required (the native `required` attribute is set). Since this compact
   *  variant has no label, the «(اختیاری)» marker is appended to the placeholder:
   *  it shows while the field is empty and disappears once the user types. */
  optional?: boolean;
  /** Virtual-keyboard hint. When set to `"numeric"` or `"decimal"` (or with
   *  `type="number"`), Persian/Arabic-Indic digits typed by the user are
   *  normalized to ASCII (e.g. ۲۵۰ → 250) so the value stays machine-readable.
   *  The custom `"currency"` mode additionally groups the number into thousands
   *  (integers only, e.g. ۲۵۰۰۰۰۰ → 2٬500٬000); on the DOM it maps to numeric. */
  inputMode?: TextInputMode;
}

/**
 * Compact single-line input (Swiss Army Figma): 40px tall, body-sm text, no
 * floating label. Supports a leading icon, inline unit, trailing adornment
 * (e.g. clear button), helper/error message, and required/optional state.
 * Numeric fields normalize Persian/Arabic digits. Pure CSS, semantic tokens, RTL.
 */
export const TextFieldSmall = forwardRef<HTMLInputElement, TextFieldSmallProps>(
  function TextFieldSmall(
    {
      helperText,
      error,
      unit,
      leadingIcon,
      trailingAdornment,
      clearable,
      onClear,
      optional,
      disabled,
      readOnly,
      id,
      placeholder,
      className,
      type,
      inputMode,
      value,
      defaultValue,
      onChange,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedById = `${inputId}-desc`;
    const hasError = Boolean(error);
    const message = error ?? helperText;

    // This compact variant has no label, so the optional marker rides along with
    // the placeholder: «(اختیاری)» shows while empty and disappears once the user
    // starts typing (native placeholder behavior).
    const effectivePlaceholder = optional
      ? [placeholder, "(اختیاری)"].filter(Boolean).join(" ")
      : placeholder;

    // Merge the forwarded ref with our own so the clear button can reach the
    // native input (works for controlled and uncontrolled usage alike).
    const innerRef = useRef<HTMLInputElement | null>(null);
    const setRef = useCallback(
      (el: HTMLInputElement | null) => {
        innerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      },
      [ref],
    );

    // Track whether the field currently has a value so the clear button can
    // show/hide. Controlled usage reads `value`; uncontrolled tracks via state.
    const isControlled = value !== undefined;
    const [uncontrolledHasValue, setUncontrolledHasValue] = useState(
      () => defaultValue != null && String(defaultValue) !== "",
    );
    const hasValue = isControlled
      ? value != null && value !== ""
      : uncontrolledHasValue;

    // Numeric fields normalize Persian/Arabic-Indic digits to ASCII as the user
    // types (and group thousands when inputMode="currency"), so the value
    // flowing out is always machine-readable (e.g. ۱۲۳ → 123).
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (isNumericMode(inputMode, type)) applyNumericFormat(event.target, inputMode);
      if (!isControlled) setUncontrolledHasValue(event.target.value !== "");
      onChange?.(event);
    };

    const handleClear = () => {
      const el = innerRef.current;
      if (el) {
        // use the native setter so React's onChange fires with the empty value
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
        data-status={hasError ? "error" : undefined}
        data-disabled={disabled ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
      >
        <div className={styles.control}>
          {leadingIcon != null && (
            <span className={styles.leadingIcon} aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          <input
            ref={setRef}
            id={inputId}
            className={styles.input}
            disabled={disabled}
            readOnly={readOnly}
            required={!optional}
            type={type}
            inputMode={domInputMode(inputMode)}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            placeholder={effectivePlaceholder}
            aria-invalid={hasError || undefined}
            aria-describedby={message != null ? describedById : undefined}
            {...rest}
          />
          {unit != null && (
            <span className={styles.unit} aria-hidden="true">
              {unit}
            </span>
          )}
          {trailingAdornment != null && (
            <span className={styles.trailing}>{trailingAdornment}</span>
          )}
          {showClear && (
            <span className={styles.trailing}>
              <button
                type="button"
                className={styles.clearButton}
                aria-label="پاک کردن"
                onClick={handleClear}
              >
                <ClearIcon />
              </button>
            </span>
          )}
        </div>
        {message != null && (
          <p id={describedById} className={styles.message}>
            {message}
          </p>
        )}
      </div>
    );
  },
);
