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

/** Filled — the label floats up to a small caption. */
export const Filled: Story = {
  args: { defaultValue: "علی رضایی" },
};

export const WithHelper: Story = {
  args: { helperText: "نام خود را مطابق کارت ملی وارد کنید." },
};

export const WithError: Story = {
  args: { error: "این فیلد الزامی است.", defaultValue: "ع" },
};

/** Optional field — shows «(اختیاری)» next to the label. Without it the field is required. */
export const Optional: Story = {
  args: { optional: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "علی رضایی", helperText: "این مقدار قابل ویرایش نیست." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "غیرقابل ویرایش" },
};

/** Currency amount — the unit (﷼) sits at the inline-start. */
export const RialAmount: Story = {
  args: {
    label: "مبلغ قسط",
    placeholder: "۲٬۵۰۰٬۰۰۰",
    unit: RIAL,
    inputMode: "numeric",
  },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24, inlineSize: 336 }}>
      <TextField {...args} label="عادی" />
      <TextField {...args} label="پرشده" defaultValue="محتوای اینپوت" />
      <TextField {...args} label="با راهنما" helperText="این یک توضیح است" />
      <TextField {...args} label="خطا" error="این یک پیام خطا است" defaultValue="مقدار" />
      <TextField {...args} label="فقط‌خواندنی" readOnly defaultValue="محتوای اینپوت" />
      <TextField {...args} label="غیرفعال" disabled defaultValue="محتوای اینپوت" />
    </div>
  ),
};
