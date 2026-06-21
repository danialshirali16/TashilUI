import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, expect } from "storybook/test";
import { InputChip } from "./InputChip";

const meta: Meta<typeof InputChip> = {
  title: "Base Components/InputChip",
  component: InputChip,
  args: { children: "لیبلش", variant: "tag", onRemove: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["tag", "limited"] },
  },
};
export default meta;

type Story = StoryObj<typeof InputChip>;

export const Tag: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Without the remove ✕ — a static label pill. */
export const NotRemovable: Story = {
  args: { removable: false },
};

/** «{count}+» overflow indicator (Figma Type=Limited). */
export const Limited: Story = {
  args: { variant: "limited", count: 3 },
};

export const LimitedDisabled: Story = {
  args: { variant: "limited", count: 3, disabled: true },
};

/** Every state side by side. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <InputChip>لیبلش</InputChip>
      <InputChip disabled>لیبلش</InputChip>
      <InputChip removable={false}>لیبلش</InputChip>
      <InputChip variant="limited" count={3} />
      <InputChip variant="limited" count={3} disabled />
    </div>
  ),
};

/** Interaction test: the remove ✕ fires `onRemove`; disabled stays inert. */
export const Test: Story = {
  args: { onRemove: fn() },
  play: async ({ canvas, args, userEvent }) => {
    const remove = canvas.getByRole("button", { name: "حذف" });
    await userEvent.click(remove);
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};
