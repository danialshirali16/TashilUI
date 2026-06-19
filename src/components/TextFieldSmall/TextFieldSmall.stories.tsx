import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextFieldSmall } from "./TextFieldSmall";
import { IconTypeHash, IconClose } from "../../icons";
import { RIAL } from "../../lib/persian";

const meta: Meta<typeof TextFieldSmall> = {
  title: "Components/TextFieldSmall",
  component: TextFieldSmall,
  args: {
    placeholder: "مقدار مورد نظر",
    unit: RIAL,
    leadingIcon: <IconTypeHash />,
    inputMode: "numeric",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 220 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TextFieldSmall>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: "۲٬۵۰۰٬۰۰۰" },
};

/** Currency mode — groups the typed number into thousands (integers only). */
export const Currency: Story = {
  args: { inputMode: "currency", placeholder: "مبلغ به ریال" },
};

/**
 * With a working trailing clear button. The clear control lives in the
 * `trailingAdornment` slot; wiring its `onClick` (and showing it only when the
 * field has a value) is the consumer's responsibility — shown here controlled.
 */
export const WithClear: Story = {
  render: (args) => {
    const [value, setValue] = useState("۲٬۵۰۰٬۰۰۰");
    return (
      <TextFieldSmall
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        trailingAdornment={
          value ? (
            <button type="button" aria-label="پاک کردن" onClick={() => setValue("")}>
              <IconClose />
            </button>
          ) : null
        }
      />
    );
  },
};

export const WithHelper: Story = {
  args: { helperText: "مبلغ را به ریال وارد کنید." },
};

export const WithError: Story = {
  args: { error: "این یک پیام خطا است", defaultValue: "۲٬۵۰۰" },
};

/** Optional — toggles the native `required` off (no visible marker in this compact variant). */
export const Optional: Story = {
  args: { optional: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "۲٬۵۰۰٬۰۰۰" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "۲٬۵۰۰٬۰۰۰" },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24, inlineSize: 220 }}>
      <TextFieldSmall {...args} />
      <TextFieldSmall {...args} defaultValue="۲٬۵۰۰٬۰۰۰" />
      <TextFieldSmall {...args} helperText="این یک توضیح است" />
      <TextFieldSmall {...args} error="این یک پیام خطا است" defaultValue="۲٬۵۰۰" />
      <TextFieldSmall {...args} readOnly defaultValue="۲٬۵۰۰٬۰۰۰" />
      <TextFieldSmall {...args} disabled defaultValue="۲٬۵۰۰٬۰۰۰" />
    </div>
  ),
};
