import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OTPField } from "./OTPField";

const meta: Meta<typeof OTPField> = {
  title: "Components/OTPField",
  component: OTPField,
  args: {
    length: 5,
  },
  argTypes: {
    length: { control: { type: "range", min: 4, max: 6, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 340 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof OTPField>;

export const Default: Story = {};

/** Some cells filled — digits render in the headline scale. */
export const Filled: Story = {
  args: { defaultValue: "۱۲۳" },
};

export const Complete: Story = {
  args: { defaultValue: "۱۲۳۴۵" },
};

export const WithHelper: Story = {
  args: { helperText: "کد ۵ رقمی ارسال‌شده را وارد کنید." },
};

export const WithError: Story = {
  args: { error: "کد واردشده نادرست است.", defaultValue: "۱۲۳۴۵" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "۱۲۳۴۵" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "۱۲۳" },
};

/**
 * Cell count is set by the developer via `length` and clamped to 4–6 — adjust
 * the `length` control to see it. Shown here with 6 cells.
 */
export const ConfigurableLength: Story = {
  args: { length: 6, defaultValue: "۱۲۳" },
};

/** Controlled — reports completion when all cells are filled. */
export const Controlled: Story = {
  render: (args) => {
    const [code, setCode] = useState("");
    const [done, setDone] = useState<string | null>(null);
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <OTPField
          {...args}
          value={code}
          onChange={setCode}
          onComplete={(v) => setDone(v)}
          helperText={done ? `تکمیل شد: ${done}` : "کد را وارد کنید."}
        />
      </div>
    );
  },
};
