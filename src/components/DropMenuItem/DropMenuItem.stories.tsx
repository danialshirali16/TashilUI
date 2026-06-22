import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, expect } from "storybook/test";
import { DropMenuItem } from "./DropMenuItem";

/* A small placeholder leading icon for the `icon` accessory. */
const HashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6 2 4.5 14M11.5 2 10 14M2.5 5.5h12M1.5 10.5h12"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const meta: Meta<typeof DropMenuItem> = {
  title: "Base Components/DropMenuItem",
  component: DropMenuItem,
  args: {
    children: "گزینه انتخابی",
    description: "توضیحات",
    size: "md",
    accessory: "none",
    onClick: fn(),
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    accessory: { control: "inline-radio", options: ["none", "icon", "checkbox"] },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 242 }} role="listbox">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DropMenuItem>;

export const Simple: Story = {};

export const WithCheckbox: Story = { args: { accessory: "checkbox" } };
export const CheckboxSelected: Story = { args: { accessory: "checkbox", selected: true } };

export const WithIcon: Story = { args: { accessory: "icon", icon: <HashIcon /> } };
export const IconSelected: Story = { args: { accessory: "icon", icon: <HashIcon />, selected: true } };

export const Disabled: Story = { args: { accessory: "checkbox", disabled: true } };

export const NoDescription: Story = { args: { description: undefined, accessory: "icon", icon: <HashIcon /> } };

/** Every type × status, both sizes. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      {(["md", "sm"] as const).map((size) => (
        <div key={size} role="listbox" style={{ inlineSize: 242 }}>
          <DropMenuItem size={size}>گزینه انتخابی</DropMenuItem>
          <DropMenuItem size={size} accessory="checkbox">گزینه انتخابی</DropMenuItem>
          <DropMenuItem size={size} accessory="checkbox" selected>گزینه انتخابی</DropMenuItem>
          <DropMenuItem size={size} accessory="icon" icon={<HashIcon />}>گزینه انتخابی</DropMenuItem>
          <DropMenuItem size={size} accessory="icon" selected>گزینه انتخابی</DropMenuItem>
          <DropMenuItem size={size} accessory="checkbox" disabled>گزینه انتخابی</DropMenuItem>
        </div>
      ))}
    </div>
  ),
};

/** Interaction test: clicking fires onClick; disabled stays inert. */
export const Test: Story = {
  args: { onClick: fn() },
  play: async ({ canvas, args, userEvent }) => {
    const option = canvas.getByRole("option");
    await userEvent.click(option);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
