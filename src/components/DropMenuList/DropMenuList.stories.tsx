import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropMenuList } from "./DropMenuList";
import { DropMenuItem } from "../DropMenuItem";

const meta: Meta<typeof DropMenuList> = {
  title: "Base Components/DropMenuList",
  component: DropMenuList,
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 242 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DropMenuList>;

export const Simple: Story = {
  render: (args) => (
    <DropMenuList {...args}>
      <DropMenuItem>گزینه انتخابی</DropMenuItem>
      <DropMenuItem>گزینه انتخابی</DropMenuItem>
      <DropMenuItem>گزینه انتخابی</DropMenuItem>
      <DropMenuItem>گزینه انتخابی</DropMenuItem>
    </DropMenuList>
  ),
};

export const Checkbox: Story = {
  args: { multiselectable: true },
  render: (args) => (
    <DropMenuList {...args}>
      <DropMenuItem accessory="checkbox" selected>گزینه انتخابی</DropMenuItem>
      <DropMenuItem accessory="checkbox">گزینه انتخابی</DropMenuItem>
      <DropMenuItem accessory="checkbox" selected>گزینه انتخابی</DropMenuItem>
      <DropMenuItem accessory="checkbox" disabled>گزینه انتخابی</DropMenuItem>
    </DropMenuList>
  ),
};
