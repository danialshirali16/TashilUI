import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Dropdown } from "./Dropdown";
import type { DropdownOption } from "./Dropdown";

const options: DropdownOption[] = [
  "گزینهٔ یک",
  "گزینهٔ دو",
  "گزینهٔ سه",
  "گزینهٔ چهار",
  "گزینهٔ پنج",
  "گزینهٔ شش",
].map((label, i) => ({ value: String(i), label }));

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  args: {
    label: "تیتر اینپوت",
    items: options,
    helperText: "این یک توضیح است",
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 240 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

/** Empty — the label rests as a placeholder until opened or filled. */
export const Idle: Story = {};

/** A single value selected. */
export const Selected: Story = { args: { defaultValue: "1" } };

export const Searchable: Story = { args: { searchable: true } };

export const Clearable: Story = { args: { defaultValue: "1", clearable: true } };

export const WithError: Story = {
  args: { defaultValue: "1", error: "این یک پیام خطا است" },
};

export const Disabled: Story = { args: { defaultValue: "1", disabled: true } };

export const Optional: Story = { args: { optional: true } };

export const WithAddNew: Story = {
  args: { searchable: true, addNewLabel: "افزودن چیز جدید", onAddNew: fn() },
};

/** Multiple selection — removable chips with a «+N» overflow. */
export const Multiple: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(["0", "1", "2", "3"]);
    return (
      <Dropdown
        {...args}
        multiple
        clearable
        searchable
        maxVisibleChips={1}
        value={value}
        onValueChange={(v) => setValue(v as string[])}
      />
    );
  },
};

/** Controlled single-select. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <Dropdown {...args} value={value} onValueChange={(v) => setValue(v as string)} />;
  },
};
