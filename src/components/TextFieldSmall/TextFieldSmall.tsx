import { forwardRef, useId } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import {
  applyNumericFormat,
  domInputMode,
  isNumericMode,
} from "../../lib/numericInput";
import type { TextInputMode } from "../../lib/numericInput";
import styles from "./TextFieldSmall.module.css";

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
  /** Trailing content at the inline-end (Figma `trailingIcon`), e.g. a clear button. */
  trailingAdornment?: ReactNode;
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
      optional,
      disabled,
      readOnly,
      id,
      placeholder,
      className,
      type,
      inputMode,
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

    // Numeric fields normalize Persian/Arabic-Indic digits to ASCII as the user
    // types (and group thousands when inputMode="currency"), so the value
    // flowing out is always machine-readable (e.g. ۱۲۳ → 123).
    const handleChange = isNumericMode(inputMode, type)
      ? (event: ChangeEvent<HTMLInputElement>) => {
          applyNumericFormat(event.target, inputMode);
          onChange?.(event);
        }
      : onChange;

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
            ref={ref}
            id={inputId}
            className={styles.input}
            disabled={disabled}
            readOnly={readOnly}
            required={!optional}
            type={type}
            inputMode={domInputMode(inputMode)}
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
