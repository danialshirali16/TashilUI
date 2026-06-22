import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, expect } from "storybook/test";
import { MenuItem } from "./MenuItem";
import { IconCopy } from "../../icons";

const meta: Meta<typeof MenuItem> = {
  title: "Base Components/MenuItem",
  component: MenuItem,
  args: {
    children: "کپی",
    description: "توضیحات",
    type: "default",
    height: "low",
    onClick: fn(),
  },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["default", "destructive", "no-icon", "checkbox"],
    },
    height: { control: "inline-radio", options: ["low", "high"] },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 220 }} role="menu">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MenuItem>;

export const Default: Story = { args: { icon: <IconCopy /> } };
export const Destructive: Story = { args: { type: "destructive", icon: <IconCopy /> } };
export const NoIcon: Story = { args: { type: "no-icon" } };
export const NoIconSelected: Story = { args: { type: "no-icon", selected: true } };
export const Checkbox: Story = { args: { type: "checkbox" } };
export const CheckboxSelected: Story = { args: { type: "checkbox", selected: true } };
export const Disabled: Story = { args: { icon: <IconCopy />, disabled: true } };
export const High: Story = { args: { icon: <IconCopy />, height: "high" } };

/** Every type × state. Radio items live in `Menu` via `RadioGroup` + `RadioButton`. */
export const AllStates: Story = {
  render: () => (
    <div role="menu" style={{ inlineSize: 220 }}>
      <MenuItem icon={<IconCopy />}>کپی</MenuItem>
      <MenuItem type="destructive" icon={<IconCopy />}>کپی</MenuItem>
      <MenuItem type="no-icon">کپی</MenuItem>
      <MenuItem type="no-icon" selected>کپی</MenuItem>
      <MenuItem type="checkbox">کپی</MenuItem>
      <MenuItem type="checkbox" selected>کپی</MenuItem>
      <MenuItem icon={<IconCopy />} disabled>کپی</MenuItem>
    </div>
  ),
};

/** Long label + description truncate to a single line with an ellipsis. */
export const LongContent: Story = {
  args: {
    icon: <IconCopy />,
    children: "یک عنوان بسیار بسیار طولانی که در عرض منو جا نمی‌شود",
    description: "توضیحات بسیار طولانی که باید در یک خط با سه‌نقطه کوتاه شود و سرریز نکند",
  },
};

/** Interaction test — clicking fires onClick; disabled stays inert. */
export const Test: Story = {
  args: { icon: <IconCopy />, onClick: fn() },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole("menuitem"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
