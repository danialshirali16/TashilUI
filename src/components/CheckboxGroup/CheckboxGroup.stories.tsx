import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IconPlus, IconTrashLine } from "../../icons";
import { toPersianDigits } from "../../lib/persian";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  args: { title: "جنسیت" },
  argTypes: {
    type: { control: "inline-radio", options: ["vertical", "input", "inline"] },
  },
};
export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

// Checkbox elements must be DIRECT children so the group can inject status.
const items = () => [
  <Checkbox key="1" defaultChecked label="گزینه اول" />,
  <Checkbox key="2" label="گزینه دوم" />,
  <Checkbox key="3" label="گزینه سوم" />,
];

export const Vertical: Story = {
  render: (args) => <CheckboxGroup {...args} type="vertical">{items()}</CheckboxGroup>,
};

export const Input: Story = {
  render: (args) => <CheckboxGroup {...args} type="input">{items()}</CheckboxGroup>,
};

export const Inline: Story = {
  render: (args) => <CheckboxGroup {...args} type="inline">{items()}</CheckboxGroup>,
};

export const Error: Story = {
  args: { error: true, message: "این یک پیام خطا است" },
  render: (args) => <CheckboxGroup {...args}>{items()}</CheckboxGroup>,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <CheckboxGroup {...args}>{items()}</CheckboxGroup>,
};

export const ReadOnly: Story = {
  args: { readOnly: true },
  render: (args) => <CheckboxGroup {...args}>{items()}</CheckboxGroup>,
};

/** Add / remove options, bounded to 1–10. */
export const Dynamic: Story = {
  render: (args) => {
    const MIN = 1;
    const MAX = 10;
    const [count, setCount] = useState(3);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <CheckboxGroup {...args}>
          {Array.from({ length: count }, (_, i) => (
            <Checkbox key={i} label={`گزینه ${toPersianDigits(i + 1)}`} />
          ))}
        </CheckboxGroup>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button
            size="sm"
            variant="outline"
            leadingIcon={<IconPlus />}
            disabled={count >= MAX}
            onClick={() => setCount((c) => Math.min(MAX, c + 1))}
          >
            افزودن
          </Button>
          <Button
            size="sm"
            variant="outline"
            intent="error"
            leadingIcon={<IconTrashLine />}
            disabled={count <= MIN}
            onClick={() => setCount((c) => Math.max(MIN, c - 1))}
          >
            حذف
          </Button>
          <span style={{ fontSize: 12, color: "var(--color-text-subtle)" }}>
            {toPersianDigits(count)} / {toPersianDigits(MAX)}
          </span>
        </div>
      </div>
    );
  },
};
