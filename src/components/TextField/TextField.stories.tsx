import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";
import { RIAL } from "../../lib/persian";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  args: {
    label: "نام و نام خانوادگی",
    placeholder: "مثلاً علی رضایی",
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const WithHelper: Story = {
  args: { helperText: "نام خود را مطابق کارت ملی وارد کنید." },
};

export const WithError: Story = {
  args: { error: "این فیلد الزامی است.", required: true },
};

export const RialAmount: Story = {
  args: {
    label: "مبلغ قسط",
    placeholder: "۲٬۵۰۰٬۰۰۰",
    trailingAdornment: RIAL,
    inputMode: "numeric",
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: "غیرقابل ویرایش" },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, inlineSize: 320 }}>
      <TextField {...args} label="عادی" />
      <TextField {...args} label="با راهنما" helperText="متن راهنما" />
      <TextField {...args} label="خطا" error="مقدار نامعتبر است." />
      <TextField {...args} label="غیرفعال" disabled value="..." />
    </div>
  ),
};
