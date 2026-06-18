import type { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cx } from "../../lib/cx";
import styles from "./Tooltip.module.css";

export interface TooltipProps {
  /** Tooltip text/content. */
  content: ReactNode;
  /** Trigger element. */
  children: ReactNode;
  /** Preferred side. @default "top" */
  side?: RadixTooltip.TooltipContentProps["side"];
  /** Open delay in ms. @default 200 */
  delayDuration?: number;
  /** Render the small pointer arrow. @default true */
  withArrow?: boolean;
  className?: string;
}

/**
 * Tooltip on Radix (hover/focus, keyboard, ARIA, collision handling).
 * Radix flips `side` automatically for RTL, so positioning stays correct.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  delayDuration = 200,
  withArrow = true,
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={cx(styles.content, className)}
        >
          {content}
          {withArrow && <RadixTooltip.Arrow className={styles.arrow} />}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}

/**
 * Wrap your app (or Storybook) once. Radix requires a Provider above any Tooltip.
 */
export const TooltipProvider = RadixTooltip.Provider;
