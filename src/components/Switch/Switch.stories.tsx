import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, expect } from "storybook/test";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  args: { onCheckedChange: fn() },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Off: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const WithLabel: Story = {
  args: { label: "اعلان‌ها", defaultChecked: true },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Switch {...args} disabled label="غیرفعال (خاموش)" />
      <Switch {...args} disabled defaultChecked label="غیرفعال (روشن)" />
    </div>
  ),
};

/** Read-only — shows the value, stays full-colour, but can't be toggled. */
export const ReadOnly: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Switch {...args} readOnly label="فقط‌خواندنی (خاموش)" />
      <Switch {...args} readOnly defaultChecked label="فقط‌خواندنی (روشن)" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Switch {...args} label="خاموش" />
      <Switch {...args} defaultChecked label="روشن" />
      <Switch {...args} disabled label="غیرفعال" />
    </div>
  ),
};

/** Interaction test — clicking toggles checked state and fires onCheckedChange. */
export const Test: Story = {
  args: { label: "تغییر وضعیت" },
  play: async ({ canvas, args }) => {
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toHaveAttribute("data-state", "unchecked");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("data-state", "checked");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
