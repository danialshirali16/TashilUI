import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, expect } from "storybook/test";
import { SearchField } from "./SearchField";

const meta: Meta<typeof SearchField> = {
  title: "Components/SearchField",
  component: SearchField,
  args: {
    placeholder: "جستجو در سفارش‌ها …",
    onSearch: fn(),
    onClear: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 300 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SearchField>;

/** Empty — placeholder + leading magnifier. */
export const Rest: Story = {};

/** Filled — a clear ✕ appears at the inline-end. */
export const Filled: Story = {
  args: { defaultValue: "محتوای قابل جستجو" },
};

/** Without the «Enter ↵» hint chip. */
export const NoEnterHint: Story = {
  args: { defaultValue: "محتوای قابل جستجو", enterHint: false },
};

export const Disabled: Story = {
  args: { defaultValue: "محتوای قابل جستجو", disabled: true },
};

/** Controlled — value + onSearch wired up. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SearchField
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={setSubmitted}
          onClear={() => setSubmitted("")}
        />
        <p style={{ font: "inherit", color: "var(--color-text-subtler)", margin: 0 }}>
          آخرین جستجو: {submitted || "—"}
        </p>
      </div>
    );
  },
};

/** Interaction test — type, press Enter, then clear. */
export const Test: Story = {
  args: { onSearch: fn(), onClear: fn() },
  play: async ({ canvas, args, userEvent }) => {
    const input = canvas.getByRole("searchbox");
    await userEvent.type(input, "سفارش");
    await userEvent.keyboard("{Enter}");
    await expect(args.onSearch).toHaveBeenCalledWith("سفارش");

    const clear = canvas.getByRole("button", { name: "پاک کردن" });
    await userEvent.click(clear);
    await expect(args.onClear).toHaveBeenCalled();
    await expect(input).toHaveValue("");
  },
};
