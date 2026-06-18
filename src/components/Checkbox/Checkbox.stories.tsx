import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { label: "قوانین و مقررات را می‌پذیرم" },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox {...args} disabled label="غیرفعال" />
      <Checkbox {...args} disabled defaultChecked label="غیرفعال و انتخاب‌شده" />
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate");
    return (
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => setChecked(v)}
        label="انتخاب همه"
      />
    );
  },
};

export const WithoutLabel: Story = { args: { label: undefined } };
