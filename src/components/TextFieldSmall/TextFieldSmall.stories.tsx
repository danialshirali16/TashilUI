import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextFieldSmall } from "./TextFieldSmall";
import { IconTypeHash } from "../../icons";
import { RIAL } from "../../lib/persian";

const meta: Meta<typeof TextFieldSmall> = {
  title: "Components/TextFieldSmall",
  component: TextFieldSmall,
  args: {
    placeholder: "مقدار مورد نظر",
    unit: RIAL,
    leadingIcon: <IconTypeHash />,
    inputMode: "numeric",
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 220 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TextFieldSmall>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: "۲٬۵۰۰٬۰۰۰" },
};

/** Currency mode — groups the typed number into thousands (integers only). */
export const Currency: Story = {
  args: { inputMode: "currency", placeholder: "مبلغ به ریال" },
};

/** Built-in clear button — set `clearable`. It appears while the field has a
 *  value and empties it on click (works for controlled and uncontrolled). */
export const WithClear: Story = {
  args: { defaultValue: "۲٬۵۰۰٬۰۰۰", clearable: true },
};

export const WithHelper: Story = {
  args: { helperText: "مبلغ را به ریال وارد کنید." },
};

export const WithError: Story = {
  args: { error: "این یک پیام خطا است", defaultValue: "۲٬۵۰۰" },
};

/** Optional — toggles the native `required` off (no visible marker in this compact variant). */
export const Optional: Story = {
  args: { optional: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "۲٬۵۰۰٬۰۰۰" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "۲٬۵۰۰٬۰۰۰" },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24, inlineSize: 220 }}>
      <TextFieldSmall {...args} />
      <TextFieldSmall {...args} defaultValue="۲٬۵۰۰٬۰۰۰" />
      <TextFieldSmall {...args} helperText="این یک توضیح است" />
      <TextFieldSmall {...args} error="این یک پیام خطا است" defaultValue="۲٬۵۰۰" />
      <TextFieldSmall {...args} readOnly defaultValue="۲٬۵۰۰٬۰۰۰" />
      <TextFieldSmall {...args} disabled defaultValue="۲٬۵۰۰٬۰۰۰" />
    </div>
  ),
};
