import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";

const meta: Meta<typeof TextArea> = {
  title: "Components/TextArea",
  component: TextArea,
  args: {
    label: "توضیحات",
    placeholder: "متن خود را وارد کنید…",
  },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {};

/** Filled — the label floats up to a small caption. */
export const Filled: Story = {
  args: { defaultValue: "این یک متن چند خطی نمونه است که داخل کادر نوشته شده است." },
};

export const WithHelper: Story = {
  args: { helperText: "حداکثر ۵۰۰ کاراکتر وارد کنید." },
};

export const WithError: Story = {
  args: { error: "این فیلد الزامی است.", defaultValue: "م" },
};

/** Optional field — shows «(اختیاری)» next to the label. Without it the field is required. */
export const Optional: Story = {
  args: { optional: true },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "این مقدار قابل ویرایش نیست.",
    helperText: "این مقدار قابل ویرایش نیست.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "غیرقابل ویرایش" },
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 32, inlineSize: 336 }}>
      <TextArea {...args} label="عادی" />
      <TextArea {...args} label="پرشده" defaultValue="محتوای اینپوت" />
      <TextArea {...args} label="با راهنما" helperText="این یک توضیح است" />
      <TextArea {...args} label="خطا" error="این یک پیام خطا است" defaultValue="مقدار" />
      <TextArea {...args} label="فقط‌خواندنی" readOnly defaultValue="محتوای اینپوت" />
      <TextArea {...args} label="غیرفعال" disabled defaultValue="محتوای اینپوت" />
    </div>
  ),
};
