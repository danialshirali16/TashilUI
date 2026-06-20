import { forwardRef, useId, useRef, useState } from "react";
import type {
  ClipboardEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { toLatinDigits } from "../../lib/persian";
import { domInputMode, isNumericMode } from "../../lib/numericInput";
import type { TextInputMode } from "../../lib/numericInput";
import styles from "./OTPField.module.css";

/** Min/max number of cells the field supports. */
const MIN_LENGTH = 4;
const MAX_LENGTH = 6;

export interface OTPFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "required" | "inputMode" | "value" | "defaultValue" | "onChange" | "maxLength"
  > {
  /** Number of code cells. Clamped to 4–6. Default 5 (Figma Swiss Army). */
  length?: number;
  /** Controlled value (the entered code). */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fires with the current code string whenever it changes. */
  onChange?: (value: string) => void;
  /** Fires with the code once all cells are filled. */
  onComplete?: (value: string) => void;
  /** Helper / description text shown below the field (Figma `message`). */
  helperText?: ReactNode;
  /** Error message — when set, the field renders in its error state. */
  error?: ReactNode;
  /** Mark the field as optional — when omitted/false (default) the field is
   *  required (the native `required` attribute is set). */
  optional?: boolean;
  /** Virtual-keyboard hint. Defaults to `"numeric"`. For numeric modes (the
   *  default), Persian/Arabic-Indic digits are normalized to ASCII and any
   *  non-digit input is dropped, so the value is always machine-readable. */
  inputMode?: TextInputMode;
}

function sanitize(
  raw: string,
  length: number,
  mode: TextInputMode | undefined,
): string {
  const value = isNumericMode(mode, undefined)
    ? toLatinDigits(raw).replace(/\D/g, "")
    : raw;
  return value.slice(0, length);
}

/**
 * Segmented one-time-code field (Swiss Army Figma): a row of 4–6 equal cells,
 * each a single-character input. Entry is left-to-right with auto-advance,
 * backspace, arrow-key navigation, click-to-edit any cell, and full-code paste.
 * Numeric by default (digits normalized to ASCII). Pure CSS, semantic tokens.
 */
export const OTPField = forwardRef<HTMLInputElement, OTPFieldProps>(
  function OTPField(
    {
      length = 5,
      value,
      defaultValue,
      onChange,
      onComplete,
      helperText,
      error,
      optional,
      disabled,
      readOnly,
      inputMode = "numeric",
      id,
      className,
      ...rest
    },
    ref,
  ) {
    const count = Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, length));
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedById = `${inputId}-desc`;
    const hasError = Boolean(error);
    const message = error ?? helperText;

    const isControlled = value !== undefined;
    const [inner, setInner] = useState(() =>
      sanitize(defaultValue ?? "", count, inputMode),
    );
    const current = isControlled
      ? sanitize(value ?? "", count, inputMode)
      : inner;

    const cellRefs = useRef<(HTMLInputElement | null)[]>([]);
    // mirrors the latest value so focus handlers see it synchronously (state
    // updates lag the programmatic focus call during auto-advance)
    const valueRef = useRef(current);
    valueRef.current = current;

    const focusCell = (i: number) => {
      const el = cellRefs.current[Math.max(0, Math.min(i, count - 1))];
      el?.focus();
      el?.select();
    };

    const commit = (nextRaw: string) => {
      const next = sanitize(nextRaw, count, inputMode);
      valueRef.current = next;
      if (!isControlled) setInner(next);
      onChange?.(next);
      if (next.length === count) onComplete?.(next);
      return next;
    };

    // Place `incoming` starting at cell `index`, overwriting in place.
    const writeFrom = (index: number, incomingRaw: string) => {
      const incoming = sanitize(incomingRaw, count, inputMode);
      if (!incoming) return;
      const merged =
        current.slice(0, index) + incoming + current.slice(index + incoming.length);
      commit(merged);
      focusCell(index + incoming.length);
    };

    const handleChange = (index: number) => (event: { target: { value: string } }) => {
      const incoming = sanitize(event.target.value, count, inputMode);
      if (!incoming) {
        // cell was cleared (e.g. selected + Delete) — drop this position
        commit(current.slice(0, index) + current.slice(index + 1));
        return;
      }
      writeFrom(index, incoming);
    };

    const handleKeyDown =
      (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
          event.preventDefault();
          if (current[index]) {
            commit(current.slice(0, index) + current.slice(index + 1));
          } else if (index > 0) {
            commit(current.slice(0, index - 1) + current.slice(index));
            focusCell(index - 1);
          }
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          focusCell(index - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          focusCell(index + 1);
        }
      };

    const handleFocus = (index: number) => () => {
      // can't focus past the first empty cell — keep entry left-to-right.
      // read the live value (valueRef), not the render-closed `current`, so
      // auto-advance to the just-filled next cell isn't bounced back.
      if (index > valueRef.current.length) {
        focusCell(valueRef.current.length);
        return;
      }
      cellRefs.current[index]?.select();
    };

    const handlePaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      writeFrom(index, event.clipboardData.getData("text"));
    };

    return (
      <div
        className={cx(styles.field, className)}
        data-status={hasError ? "error" : undefined}
        data-disabled={disabled ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
      >
        <div className={styles.control}>
          {Array.from({ length: count }, (_, i) => (
            <input
              key={i}
              ref={(el) => {
                cellRefs.current[i] = el;
                if (i === 0) {
                  if (typeof ref === "function") ref(el);
                  else if (ref) ref.current = el;
                }
              }}
              id={i === 0 ? inputId : undefined}
              className={styles.cell}
              type="text"
              inputMode={domInputMode(inputMode)}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={current[i] ?? ""}
              disabled={disabled}
              readOnly={readOnly}
              required={i === 0 ? !optional : undefined}
              onChange={handleChange(i)}
              onKeyDown={handleKeyDown(i)}
              onFocus={handleFocus(i)}
              onClick={(e) => e.currentTarget.select()}
              onPaste={handlePaste(i)}
              aria-label={`رقم ${i + 1} از ${count}`}
              aria-invalid={hasError || undefined}
              aria-describedby={message != null ? describedById : undefined}
              {...(i === 0 ? rest : {})}
            />
          ))}
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
