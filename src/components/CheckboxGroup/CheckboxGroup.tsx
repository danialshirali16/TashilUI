import { Children, cloneElement, forwardRef, isValidElement, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../../lib/cx";
import type { CheckboxProps } from "../Checkbox";
import styles from "./CheckboxGroup.module.css";

export interface CheckboxGroupProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Group title (Figma `Title`). */
  title?: ReactNode;
  /** Item layout: stacked (`vertical`) or wrapping row (`horizontal`). */
  orientation?: "vertical" | "horizontal";
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
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(
    { title, orientation = "vertical", message, error, disabled, readOnly, className, children, ...rest },
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
        {title != null && (
          <span id={titleId} className={styles.title}>
            {title}
          </span>
        )}
        <div className={cx(styles.items, orientation === "horizontal" && styles.horizontal)}>
          {items}
        </div>
        {error && message != null && (
          <p id={messageId} className={styles.message} role="alert">
            {message}
          </p>
        )}
      </div>
    );
  },
);
