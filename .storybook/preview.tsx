import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { TooltipProvider } from "../src/components/Tooltip";
import "../src/styles/global.css";

/** Apply theme + direction to <html> so portalled content (Modal/Tooltip) inherits them. */
const withThemeAndDir: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "tashilpay";
  const dir = context.globals.direction ?? "rtl";
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    html.setAttribute("dir", dir);
    // Render on a real surface so neutral/ghost (dark-on-light) styles read correctly.
    document.body.style.background = "var(--color-background-neutral-zero-default)";
    document.body.style.color = "var(--color-text-default)";
    document.body.style.padding = "24px";
  }, [theme, dir]);
  return (
    <TooltipProvider>
      <Story />
    </TooltipProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Product",
      description: "Switch the product theme",
      defaultValue: "tashilpay",
      toolbar: {
        title: "Product",
        icon: "paintbrush",
        items: [
          { value: "tashilpay", title: "TashilPay" },
          { value: "zamyad", title: "Zamyad" },
          { value: "zhina", title: "Zhina" },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Writing direction",
      defaultValue: "rtl",
      toolbar: {
        icon: "transfer",
        items: [
          { value: "rtl", title: "RTL" },
          { value: "ltr", title: "LTR" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withThemeAndDir],
  parameters: {
    controls: { expanded: true },
  },
};

export default preview;
