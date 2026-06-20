import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioButton } from "./RadioButton";
import { RadioGroup } from "../RadioGroup";

const meta: Meta<typeof RadioButton> = {
  title: "Components/RadioButton",
  component: RadioButton,
  // RadioButton must live inside a RadioGroup (Radix provides the selection context)
  decorators: [
    (Story) => (
      <RadioGroup defaultValue="a">
        <Story />
      </RadioGroup>
    ),
  ],
  args: { value: "a", label: "گزینه انتخابی" },
};
export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Unselected: Story = {
  args: { value: "b" },
};

export const Selected: Story = {
  args: { value: "a" },
};

export const Error: Story = {
  args: { value: "a", error: true },
};

/** Optional — «(اختیاری)» appears after the label, styled like the label. */
export const Optional: Story = {
  args: { value: "a", optional: true },
};

export const ReadOnly: Story = {
  args: { value: "a", readOnly: true },
};

export const Disabled: Story = {
  args: { value: "a", disabled: true },
};

/** All states side by side (each in its own group). */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <RadioGroup defaultValue="x">
        <RadioButton value="y" label="انتخاب‌نشده" />
        <RadioButton value="x" label="انتخاب‌شده" />
      </RadioGroup>
      <RadioGroup defaultValue="x" error="">
        <RadioButton value="x" label="خطا" error />
      </RadioGroup>
      <RadioGroup defaultValue="x">
        <RadioButton value="x" label="فقط‌خواندنی" readOnly />
        <RadioButton value="z" label="غیرفعال" disabled />
      </RadioGroup>
    </div>
  ),
};
