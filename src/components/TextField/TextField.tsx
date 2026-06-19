import { forwardRef, useId } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { toLatinDigits } from "../../lib/persian";
import styles from "./TextField.module.css";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "required"> {
  /** Floating label / title (Figma `title`). Rests in the placeholder spot and
   *  floats up to a small caption on focus or when filled. */
  label?: ReactNode;
  /** Helper / description text shown below the field (Figma `message`). */
  helperText?: ReactNode;
  /** Error message — when set, the field renders in its error state. */
  error?: ReactNode;
  /** Unit adornment at the inline-start, e.g. ﷼ for amounts (Figma `unit`). */
  unit?: ReactNode;
  /** Trailing content at the inline-end, e.g. a clear button / icon. */
  trailingAdornment?: ReactNode;
  /** Mark the field as optional — shows «(اختیاری)» next to the label, styled
   *  like the label. When omitted/false (default) the field is required (the
   *  native `required` attribute is set). */
  optional?: boolean;
  /** Virtual-keyboard hint. When set to `"numeric"` or `"decimal"` (or with
   *  `type="number"`), Persian/Arabic-Indic digits typed by the user are
   *  normalized to ASCII (e.g. ۲۵۰ → 250) so the value stays machine-readable. */
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

/**
 * Single-line text field with a floating label (Swiss Army Figma): 56px tall,
 * label rests as the placeholder and floats up on focus/fill, optional unit +
 * trailing icon + helper/error message. Pure CSS, semantic tokens, RTL-aware.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      helperText,
      error,
      unit,
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

    // Numeric fields normalize Persian/Arabic-Indic digits to ASCII as the user
    // types, so the value flowing out is always machine-readable (e.g. ۱۲۳ → 123).
    const isNumeric =
      type === "number" || inputMode === "numeric" || inputMode === "decimal";

    const handleChange = isNumeric
      ? (event: ChangeEvent<HTMLInputElement>) => {
          const el = event.target;
          const latin = toLatinDigits(el.value);
          if (latin !== el.value) {
            // 1:1, length-preserving replacement — keep the caret where it was
            const { selectionStart, selectionEnd } = el;
            el.value = latin;
            try {
              el.setSelectionRange(selectionStart, selectionEnd);
            } catch {
              /* type="number" inputs don't support setSelectionRange */
            }
          }
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
          <div className={styles.inputWrap}>
            <input
              ref={ref}
              id={inputId}
              className={styles.input}
              disabled={disabled}
              readOnly={readOnly}
              required={!optional}
              type={type}
              inputMode={inputMode}
              onChange={handleChange}
              // a placeholder is required for :placeholder-shown to drive the float
              placeholder={placeholder ?? " "}
              aria-invalid={hasError || undefined}
              aria-describedby={message != null ? describedById : undefined}
              {...rest}
            />
            {label != null && (
              <label className={styles.label} htmlFor={inputId}>
                {label}
                {optional && <span className={styles.optionalTag}>(اختیاری)</span>}
              </label>
            )}
          </div>
          {trailingAdornment != null && (
            <span className={styles.trailing}>{trailingAdornment}</span>
          )}
          {/* unit (e.g. ﷼) sits at the inline-end — visually left in RTL */}
          {unit != null && (
            <span className={styles.unit} aria-hidden="true">
              {unit}
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
