import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { cx } from "../../lib/cx";
import type { RadioButtonProps } from "../RadioButton";
import styles from "./RadioGroup.module.css";

export interface RadioGroupProps
  extends Omit<
    ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>,
    "title"
  > {
  /** Group title (Figma `Title`). */
  title?: ReactNode;
  /**
   * Layout (Figma `Type`):
   * - `vertical` — title above, radios stacked.
   * - `input` — title above, radios in a wrapping row.
   * - `inline` — title and radios on one line.
   */
  type?: "vertical" | "input" | "inline";
  /** Helper / description text shown below the group. */
  helperText?: ReactNode;
  /** Error message — when set, the group renders in its error state (red
   *  message, error propagated to every radio). Takes priority over helperText. */
  error?: ReactNode;
  /** Make every radio read-only. */
  readOnly?: boolean;
  /** Show «(اختیاری)» after the title, styled like the title. */
  optional?: boolean;
}

/**
 * A labelled group of `RadioButton`s (Swiss Army Figma `RadioGroup`), built on
 * Radix RadioGroup (single-selection, roving focus, arrow-key navigation). The
 * group status (`error` / `disabled` / `readOnly`) is propagated to each child —
 * set it on the group, not on every radio. Child-level props still win.
 *
 * Pass `RadioButton` elements as direct children (each with a `value`).
 */
export const RadioGroup = forwardRef<
  ElementRef<typeof RadixRadioGroup.Root>,
  RadioGroupProps
>(function RadioGroup(
  {
    title,
    type = "vertical",
    helperText,
    error,
    disabled,
    readOnly,
    optional,
    dir,
    className,
    children,
    ...rest
  },
  ref,
) {
  const titleId = useId();
  const messageId = useId();
  const hasError = Boolean(error);
  const message = error ?? helperText;

  // Radix RadioGroup.Root stamps `dir="ltr"` by default, which would override the
  // page's RTL for everything inside the group. Resolve the ambient direction
  // from the mounted element (honoring the page/toolbar) unless `dir` is explicit.
  const innerRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      innerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  const [resolvedDir, setResolvedDir] = useState<"ltr" | "rtl">(dir ?? "rtl");
  useLayoutEffect(() => {
    if (dir) {
      setResolvedDir(dir);
      return;
    }
    // read the parent's direction: the element itself already carries the `dir`
    // Radix stamped, so its own computed direction would just echo that back.
    const el = innerRef.current?.parentElement ?? innerRef.current;
    if (el) {
      const d = getComputedStyle(el).direction;
      if (d === "ltr" || d === "rtl") setResolvedDir(d);
    }
  }, [dir]);

  const items = Children.map(children, (child) => {
    if (!isValidElement<RadioButtonProps>(child)) return child;
    return cloneElement(child, {
      error: child.props.error ?? hasError,
      disabled: child.props.disabled ?? disabled,
      readOnly: child.props.readOnly ?? readOnly,
    });
  });

  const titleEl =
    title != null ? (
      <span id={titleId} className={styles.title}>
        {title}
        {optional && <span className={styles.optionalTag}>(اختیاری)</span>}
      </span>
    ) : null;

  const itemsEl = (
    <div className={cx(styles.items, type !== "vertical" && styles.row)}>{items}</div>
  );

  return (
    <RadixRadioGroup.Root
      ref={setRef}
      dir={resolvedDir}
      aria-labelledby={title != null ? titleId : undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={message != null ? messageId : undefined}
      data-status={hasError ? "error" : undefined}
      data-disabled={disabled ? "" : undefined}
      disabled={disabled}
      orientation={type === "vertical" ? "vertical" : "horizontal"}
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
      {message != null && (
        <p
          id={messageId}
          className={styles.message}
          role={hasError ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </RadixRadioGroup.Root>
  );
});
