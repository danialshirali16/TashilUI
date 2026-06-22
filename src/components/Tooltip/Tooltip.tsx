import type { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cx } from "../../lib/cx";
import styles from "./Tooltip.module.css";

export interface TooltipProps {
  /** Tooltip text/content. */
  content: ReactNode;
  /** Trigger element. */
  children: ReactNode;
  /** Preferred side (Figma `positioned`). @default "top" */
  side?: RadixTooltip.TooltipContentProps["side"];
  /** Alignment along the side (Figma `placement` Start/Middle/End). @default "center" */
  align?: RadixTooltip.TooltipContentProps["align"];
  /** Open delay in ms (Figma: 100). @default 100 */
  delayDuration?: number;
  /** Render the small pointer arrow (Figma: optional, off by default). @default false */
  withArrow?: boolean;
  /** Minimum distance kept from the viewport edges, in px. @default 8 */
  collisionPadding?: RadixTooltip.TooltipContentProps["collisionPadding"];
  className?: string;
}

/**
 * Tooltip on Radix (hover/focus, keyboard, ARIA, collision handling), styled to
 * the Swiss Army Figma: slate surface, 8px padding, radius-2, body/sm text,
 * 256px max width, GROW motion. Radix flips `side` for RTL automatically.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 100,
  withArrow = false,
  collisionPadding = 8,
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={collisionPadding}
          className={cx(styles.content, className)}
        >
          {content}
          {withArrow && (
            <RadixTooltip.Arrow className={styles.arrow} width={12} height={6} />
          )}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}

/**
 * Wrap your app (or Storybook) once. Radix requires a Provider above any Tooltip.
 */
export const TooltipProvider: typeof RadixTooltip.Provider = RadixTooltip.Provider;
