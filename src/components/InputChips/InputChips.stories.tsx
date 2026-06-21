import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputChips } from "./InputChips";
import { InputChip } from "../InputChip";

const meta: Meta<typeof InputChips> = {
  title: "Base Components/InputChips",
  component: InputChips,
  render: (args) => (
    <InputChips {...args}>
      <InputChip>لیبلش</InputChip>
      <InputChip>لیبلش</InputChip>
      <InputChip>لیبلش</InputChip>
      <InputChip>لیبلش</InputChip>
    </InputChips>
  ),
};
export default meta;

type Story = StoryObj<typeof InputChips>;

export const Default: Story = {};

/** With a trailing «+N» overflow indicator (Figma Inputs/elements/Chips). */
export const WithOverflow: Story = {
  args: { overflow: 3 },
};

/**
 * Removable — `InputChip` is controlled: the ✕ fires `onRemove`, the parent owns the list.
 * Click any ✕ to drop that chip.
 */
export const Removable: Story = {
  render: () => {
    const [items, setItems] = useState(["سیب", "پرتقال", "هلو", "انگور"]);
    return (
      <InputChips>
        {items.map((item) => (
          <InputChip
            key={item}
            onRemove={() => setItems((prev) => prev.filter((i) => i !== item))}
          >
            {item}
          </InputChip>
        ))}
      </InputChips>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <InputChips overflow={3} disabled>
      <InputChip disabled>لیبلش</InputChip>
      <InputChip disabled>لیبلش</InputChip>
      <InputChip disabled>لیبلش</InputChip>
    </InputChips>
  ),
};
