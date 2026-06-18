import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  args: { title: "جنسیت" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
  },
};
export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

const Items = () => (
  <>
    <Checkbox defaultChecked label="گزینه اول" />
    <Checkbox label="گزینه دوم" />
    <Checkbox label="گزینه سوم" />
  </>
);

export const Vertical: Story = {
  render: (args) => (
    <CheckboxGroup {...args}>
      <Items />
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <CheckboxGroup {...args} orientation="horizontal">
      <Items />
    </CheckboxGroup>
  ),
};

export const Error: Story = {
  args: { error: true, message: "این یک پیام خطا است" },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Items />
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Items />
    </CheckboxGroup>
  ),
};

export const ReadOnly: Story = {
  args: { readOnly: true },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Items />
    </CheckboxGroup>
  ),
};
