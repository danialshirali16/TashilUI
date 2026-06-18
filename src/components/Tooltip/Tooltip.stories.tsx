import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: { content: "راهنمای این دکمه" },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

const LONG =
  "عرض ماکسیموم تولتیپ ۲۵۶ می‌باشد که اگر پدینگ چپ و راست را کم کنیم ۲۴۰ پیکسل برای نمایش متن فضا داریم.";

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button intent="neutral" variant="tonal">نشانگر را نگه دارید</Button>
    </Tooltip>
  ),
};

export const WithArrow: Story = {
  args: { withArrow: true },
  render: (args) => (
    <Tooltip {...args}>
      <Button intent="neutral" variant="tonal">با مثلث نشانگر</Button>
    </Tooltip>
  ),
};

/** Wraps at the 256px max width. */
export const LongText: Story = {
  args: { content: LONG },
  render: (args) => (
    <Tooltip {...args}>
      <Button intent="neutral" variant="tonal">متن طولانی</Button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  args: { withArrow: true },
  render: (args) => (
    <div style={{ display: "flex", gap: 24, padding: 64 }}>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip {...args} key={side} side={side} content={`جهت: ${side}`}>
          <Button intent="neutral" variant="tonal">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Placement along the side: start / center / end. */
export const Alignment: Story = {
  args: { side: "bottom", withArrow: true },
  render: (args) => (
    <div style={{ display: "flex", gap: 24, padding: 48 }}>
      {(["start", "center", "end"] as const).map((align) => (
        <Tooltip {...args} key={align} align={align} content={`چینش: ${align}`}>
          <Button intent="neutral" variant="tonal">{align}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
