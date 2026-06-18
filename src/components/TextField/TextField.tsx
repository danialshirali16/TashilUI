import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./TextField.module.css";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visible field label. */
  label?: ReactNode;
  /** Helper text shown below the field. */
  helperText?: ReactNode;
  /** Error message — when set, the field renders in its error state. */
  error?: ReactNode;
  /** Content at the inline-start of the field (visually right in RTL). */
  leadingAdornment?: ReactNode;
  /** Content at the inline-end — e.g. the Rial symbol ﷼ for amounts. */
  trailingAdornment?: ReactNode;
  /** Mark the field as required (adds a * to the label). */
  required?: boolean;
}

/**
 * Standard single-line text input. Pure CSS, semantic tokens only, RTL-aware
 * (text aligns to the inline start; leading adornment sits inline-start).
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      helperText,
      error,
      leadingAdornment,
      trailingAdornment,
      required,
      disabled,
      id,
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
        className={cx(
          styles.field,
          hasError && styles.error,
          disabled && styles.disabled,
          className,
        )}
      >
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className={styles.control}>
          {leadingAdornment && (
            <span className={styles.adornment}>{leadingAdornment}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={message ? describedById : undefined}
            {...rest}
          />
          {trailingAdornment && (
            <span className={styles.adornment}>{trailingAdornment}</span>
          )}
        </div>
        {message && (
          <span
            id={describedById}
            className={cx(styles.message, hasError && styles.errorMessage)}
          >
            {message}
          </span>
        )}
      </div>
    );
  },
);
