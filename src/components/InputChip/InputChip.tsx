import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";
import { toPersianDigits } from "../../lib/persian";
import styles from "./InputChip.module.css";

/** Figma "Type" axis. */
export type InputChipVariant = "tag" | "limited";

export interface InputChipProps extends Omit<HTMLAttributes<HTMLDivElement>, "onRemove"> {
  /**
   * Figma type axis.
   * - `"tag"` — a removable label pill (label + ✕). The default.
   * - `"limited"` — a «{count}+» overflow indicator (no background).
   * @default "tag"
   */
  variant?: InputChipVariant;
  /** Label content (tag variant). */
  children?: ReactNode;
  /** Disabled visual state — dims the chip and blocks the remove button. */
  disabled?: boolean;
  /** Render the remove ✕ button (tag variant). @default true */
  removable?: boolean;
  /** Called when the remove ✕ is activated (tag variant). */
  onRemove?: () => void;
  /** Accessible label for the remove button. @default «حذف» */
  removeLabel?: string;
  /** Overflow count (limited variant) — renders «{count}+» with Persian digits. */
  count?: number;
}

/* 12px ✕ glyph drawn on a 12 viewBox (Figma "Remove", inset 18.75%). */
const RemoveIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2.5 2.5 9.5 9.5M9.5 2.5 2.5 9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * InputChip — the Swiss Army `Inputs/base/Chips` atom. An internal building block for the
 * chips / multi-select Input components (not a standalone control). Pure CSS, semantic tokens,
 * RTL-correct (label sits inline-start, the remove ✕ inline-end). Controlled: the ✕ fires
 * `onRemove`; the parent owns the list.
 */
export const InputChip = forwardRef<HTMLDivElement, InputChipProps>(function InputChip(
  {
    variant = "tag",
    children,
    disabled = false,
    removable = true,
    onRemove,
    removeLabel = "حذف",
    count = 0,
    className,
    ...rest
  },
  ref,
) {
  if (variant === "limited") {
    return (
      <div
        ref={ref}
        data-variant="limited"
        data-disabled={disabled || undefined}
        className={cx(styles.root, className)}
        {...rest}
      >
        {toPersianDigits(count)}+
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-variant="tag"
      data-disabled={disabled || undefined}
      className={cx(styles.root, className)}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
      {removable && (
        <button
          type="button"
          className={styles.remove}
          onClick={onRemove}
          disabled={disabled}
          aria-label={removeLabel}
        >
          <RemoveIcon />
        </button>
      )}
    </div>
  );
});
