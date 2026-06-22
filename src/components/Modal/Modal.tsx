import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cx } from "../../lib/cx";
import styles from "./Modal.module.css";

export interface ModalProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the modal (wrapped in Radix Trigger). */
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Footer actions row (e.g. confirm / cancel buttons). */
  footer?: ReactNode;
  /** Hide the default close (×) button. */
  hideClose?: boolean;
  children?: ReactNode;
  className?: string;
}

const CloseIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
    <path
      d="M4 4L12 12M12 4L4 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Accessible modal dialog on Radix (focus trap, scroll lock, Esc, ARIA).
 * ScrimBG = the overlay. Content stays direction-agnostic via logical props.
 */
export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  hideClose,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={cx(styles.content, className)}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            {!hideClose && (
              <Dialog.Close
                className={styles.close}
                aria-label="بستن"
              >
                <CloseIcon />
              </Dialog.Close>
            )}
          </div>
          {description && (
            <Dialog.Description className={styles.description}>
              {description}
            </Dialog.Description>
          )}
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Re-export Radix Close so consumers can close from custom footer buttons. */
export const ModalClose: typeof Dialog.Close = Dialog.Close;
