import { forwardRef, useCallback, useId, useLayoutEffect, useRef } from "react";
import type {
  FormEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import styles from "./TextArea.module.css";

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "required"> {
  /** Floating label / title (Figma `title`). Rests near the top of the box and
   *  floats up to a small caption on focus or when filled. */
  label?: ReactNode;
  /** Helper / description text shown below the field (Figma `message`). */
  helperText?: ReactNode;
  /** Error message — when set, the field renders in its error state. */
  error?: ReactNode;
  /** Mark the field as optional — shows «(اختیاری)» next to the label, styled
   *  like the label. When omitted/false (default) the field is required (the
   *  native `required` attribute is set). */
  optional?: boolean;
}

/**
 * Multi-line text area with a floating label (Swiss Army Figma): 80px min
 * height, the label rests as the placeholder and floats up on focus/fill, with
 * helper/error message and optional/required marker. Pure CSS, semantic tokens,
 * RTL-aware. Mirrors TextField but vertically resizable and multi-line.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      label,
      helperText,
      error,
      optional,
      disabled,
      readOnly,
      id,
      placeholder,
      className,
      onInput,
      value,
      defaultValue,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedById = `${inputId}-desc`;
    const hasError = Boolean(error);
    const message = error ?? helperText;

    // Auto-grow: the box height tracks the content. Reset to `auto` first so the
    // textarea can also shrink, then set it to fit the scroll height.
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const resize = useCallback((el: HTMLTextAreaElement | null) => {
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    // Merge the forwarded ref with our own, resizing once we have the node.
    const setRef = useCallback(
      (el: HTMLTextAreaElement | null) => {
        innerRef.current = el;
        resize(el);
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      },
      [ref, resize],
    );

    // Re-fit whenever the (controlled) value changes.
    useLayoutEffect(() => {
      resize(innerRef.current);
    }, [value, resize]);

    const handleInput = (event: FormEvent<HTMLTextAreaElement>) => {
      resize(event.currentTarget);
      onInput?.(event);
    };

    return (
      <div
        className={cx(styles.field, className)}
        data-status={hasError ? "error" : undefined}
        data-disabled={disabled ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
      >
        <div className={styles.control}>
          <div className={styles.inputWrap}>
            <textarea
              ref={setRef}
              id={inputId}
              className={styles.textarea}
              disabled={disabled}
              readOnly={readOnly}
              required={!optional}
              rows={1}
              value={value}
              defaultValue={defaultValue}
              onInput={handleInput}
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
