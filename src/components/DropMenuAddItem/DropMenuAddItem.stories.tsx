import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, expect } from "storybook/test";
import { DropMenuAddItem } from "./DropMenuAddItem";

const meta: Meta<typeof DropMenuAddItem> = {
  title: "Base Components/DropMenuAddItem",
  component: DropMenuAddItem,
  args: { children: "افزودن چیز جدید", onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 242 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DropMenuAddItem>;

export const Default: Story = {};

/** Interaction test: clicking fires onClick. */
export const Test: Story = {
  args: { onClick: fn() },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
