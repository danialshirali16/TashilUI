import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./RadioGroup";
import { RadioButton } from "../RadioButton";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: { title: "جنسیت", defaultValue: "1" },
  argTypes: {
    type: { control: "inline-radio", options: ["vertical", "input", "inline"] },
  },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

// RadioButton elements must be DIRECT children so the group can inject status.
const items = () => [
  <RadioButton key="1" value="1" label="گزینه اول" />,
  <RadioButton key="2" value="2" label="گزینه دوم" />,
  <RadioButton key="3" value="3" label="گزینه سوم" />,
];

export const Vertical: Story = {
  render: (args) => (
    <RadioGroup {...args} type="vertical">
      {items()}
    </RadioGroup>
  ),
};

export const Input: Story = {
  render: (args) => (
    <RadioGroup {...args} type="input">
      {items()}
    </RadioGroup>
  ),
};

export const Inline: Story = {
  render: (args) => (
    <RadioGroup {...args} type="inline">
      {items()}
    </RadioGroup>
  ),
};

/** Optional — «(اختیاری)» appears after the title, styled like the title. */
export const Optional: Story = {
  render: (args) => (
    <RadioGroup {...args} optional>
      {items()}
    </RadioGroup>
  ),
};

export const WithHelper: Story = {
  render: (args) => (
    <RadioGroup {...args} helperText="یکی از گزینه‌ها را انتخاب کنید.">
      {items()}
    </RadioGroup>
  ),
};

export const Error: Story = {
  render: (args) => (
    <RadioGroup {...args} error="انتخاب یک گزینه الزامی است.">
      {items()}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args} disabled>
      {items()}
    </RadioGroup>
  ),
};

export const ReadOnly: Story = {
  render: (args) => (
    <RadioGroup {...args} readOnly>
      {items()}
    </RadioGroup>
  ),
};
