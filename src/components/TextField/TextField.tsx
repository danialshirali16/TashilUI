import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./TextField.module.css";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
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
  /** Mark the field required (adds * to the label). */
  required?: boolean;
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
      required,
      disabled,
      readOnly,
      id,
      placeholder,
      className,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedById = `${inputId}-desc`;
    const hasError = Boolean(error);
    const message = error ?? helperText;

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
              required={required}
              // a placeholder is required for :placeholder-shown to drive the float
              placeholder={placeholder ?? " "}
              aria-invalid={hasError || undefined}
              aria-describedby={message != null ? describedById : undefined}
              {...rest}
            />
            {label != null && (
              <label className={styles.label} htmlFor={inputId}>
                {label}
                {required && (
                  <span className={styles.required} aria-hidden="true">
                    *
                  </span>
                )}
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
