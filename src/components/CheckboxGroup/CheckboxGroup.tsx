import { Children, cloneElement, forwardRef, isValidElement, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../lib/cx";
import type { CheckboxProps } from "../Checkbox";
import styles from "./CheckboxGroup.module.css";

export interface CheckboxGroupProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Group title (Figma `Title`). */
  title?: ReactNode;
  /**
   * Layout (Figma `Type`):
   * - `vertical` — title above, items stacked.
   * - `input` — title above, items in a wrapping row.
   * - `inline` — title and items on one line.
   */
  type?: "vertical" | "input" | "inline";
  /** Helper / error message shown below the group (rendered when `error`). */
  message?: ReactNode;
  /** Error status — propagated to every child + red message. */
  error?: boolean;
  /** Disable every checkbox in the group. */
  disabled?: boolean;
  /** Make every checkbox read-only. */
  readOnly?: boolean;
}

/**
 * A labelled group of `Checkbox`es (Swiss Army Figma `CheckboxGroup`). The group
 * status (`error` / `disabled` / `readOnly`) is propagated to each child — set it
 * on the group, not on every box. Child-level props still win.
 *
 * Pass `Checkbox` elements as direct children (not wrapped in another component),
 * so the group can inject status into each one.
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(
    { title, type = "vertical", message, error, disabled, readOnly, className, children, ...rest },
    ref,
  ) {
    const titleId = useId();
    const messageId = useId();

    const items = Children.map(children, (child) => {
      if (!isValidElement<CheckboxProps>(child)) return child;
      return cloneElement(child, {
        error: child.props.error ?? error,
        disabled: child.props.disabled ?? disabled,
        readOnly: child.props.readOnly ?? readOnly,
      });
    });

    const titleEl =
      title != null ? (
        <span id={titleId} className={styles.title}>
          {title}
        </span>
      ) : null;

    const itemsEl = (
      <div className={cx(styles.items, type !== "vertical" && styles.row)}>{items}</div>
    );

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={title != null ? titleId : undefined}
        aria-invalid={error || undefined}
        aria-describedby={error && message != null ? messageId : undefined}
        data-disabled={disabled ? "" : undefined}
        className={cx(styles.group, className)}
        {...rest}
      >
        {type === "inline" ? (
          <div className={styles.inlineRow}>
            {titleEl}
            {itemsEl}
          </div>
        ) : (
          <>
            {titleEl}
            {itemsEl}
          </>
        )}
        {error && message != null && (
          <p id={messageId} className={styles.message} role="alert">
            {message}
          </p>
        )}
      </div>
    );
  },
);
