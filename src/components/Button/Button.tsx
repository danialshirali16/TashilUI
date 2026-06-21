import { forwardRef } from "react";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { cx } from "../../lib/cx";
import styles from "./Button.module.css";

/** Color intent — maps to the Figma component (Button/Primary, /Secondary, …). */
export type ButtonIntent = "primary" | "secondary" | "neutral" | "success" | "error";
/** Visual style — Figma "Style" axis. */
export type ButtonVariant = "solid" | "tonal" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Color intent. @default "primary" */
  intent?: ButtonIntent;
  /** Visual style. @default "solid" */
  variant?: ButtonVariant;
  /** @default "md" (Small=32 / Medium=40 / Large=48) */
  size?: ButtonSize;
  /** Stretch to fill the container's inline size. */
  fill?: boolean;
  /** Icon before the label (inline-start — visually right in RTL). */
  leadingIcon?: ReactNode;
  /** Icon after the label (inline-end). */
  trailingIcon?: ReactNode;
  /** Square icon-only button (Figma "Single Icon"). Pass the icon as children. */
  iconOnly?: boolean;
  /** Show a spinner and block interaction. */
  loading?: boolean;
}

/**
 * Button — faithful to Swiss Army Figma. Native <button>, pure CSS, semantic
 * tokens only. RTL-correct: leading icon sits inline-start.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent = "primary",
    variant = "solid",
    size = "md",
    fill = false,
    leadingIcon,
    trailingIcon,
    iconOnly = false,
    loading = false,
    disabled,
    type = "button",
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  // Loading uses aria-disabled (not native `disabled`) so the element still
  // receives hover and honours `cursor: progress` — native disabled buttons
  // ignore the cursor property. Clicks are blocked here instead.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      data-intent={intent}
      data-variant={variant}
      className={cx(
        styles.root,
        styles[size],
        styles[variant],
        styles[intent],
        iconOnly && styles.iconOnly,
        fill && styles.fill,
        loading && styles.loading,
        className,
      )}
      {...rest}
    >
      <span className={cx(styles.content, loading && styles.contentHidden)}>
        {iconOnly ? (
          <span className={styles.icon} aria-hidden="true">
            {children}
          </span>
        ) : (
          <>
            {leadingIcon && (
              <span className={styles.icon} aria-hidden="true">
                {leadingIcon}
              </span>
            )}
            {children}
            {trailingIcon && (
              <span className={styles.icon} aria-hidden="true">
                {trailingIcon}
              </span>
            )}
          </>
        )}
      </span>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </button>
  );
});
