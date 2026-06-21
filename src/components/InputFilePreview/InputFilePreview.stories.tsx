import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputFilePreview } from "./InputFilePreview";

const meta: Meta<typeof InputFilePreview> = {
  title: "Base Components/InputFilePreview",
  component: InputFilePreview,
  args: { type: "image", size: "large" },
  argTypes: {
    type: { control: "inline-radio", options: ["image", "pdf", "file"] },
    size: { control: "inline-radio", options: ["large", "small"] },
  },
};
export default meta;

type Story = StoryObj<typeof InputFilePreview>;

export const Image: Story = { args: { type: "image" } };
export const Pdf: Story = { args: { type: "pdf" } };
export const File: Story = { args: { type: "file" } };

export const SmallImage: Story = { args: { type: "image", size: "small" } };
export const SmallPdf: Story = { args: { type: "pdf", size: "small" } };
export const SmallFile: Story = { args: { type: "file", size: "small" } };

/** Every type × size. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <InputFilePreview type="image" size="large" />
        <InputFilePreview type="image" size="small" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <InputFilePreview type="pdf" size="large" />
        <InputFilePreview type="pdf" size="small" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <InputFilePreview type="file" size="large" />
        <InputFilePreview type="file" size="small" />
      </div>
    </div>
  ),
};
