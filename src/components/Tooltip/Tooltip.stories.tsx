import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: { content: "راهنمای این دکمه" },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button intent="neutral" variant="tonal">نشانگر را نگه دارید</Button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, padding: 48 }}>
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip {...args} key={side} side={side} content={`جهت: ${side}`}>
          <Button intent="neutral" variant="tonal">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
