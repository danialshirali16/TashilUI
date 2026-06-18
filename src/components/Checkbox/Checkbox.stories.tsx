import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { label: "قوانین و مقررات را می‌پذیرم" },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox {...args} disabled label="غیرفعال" />
      <Checkbox {...args} disabled defaultChecked label="غیرفعال و انتخاب‌شده" />
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate");
    return (
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => setChecked(v)}
        label="انتخاب همه"
      />
    );
  },
};

export const WithoutLabel: Story = { args: { label: undefined } };

export const Error: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox {...args} error label="یک گزینه را انتخاب کنید" />
      <Checkbox {...args} error defaultChecked label="انتخاب‌شده (خطا)" />
      <Checkbox {...args} error checked="indeterminate" label="نیمه‌انتخاب (خطا)" />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox {...args} readOnly label="فقط‌خواندنی" />
      <Checkbox {...args} readOnly defaultChecked label="فقط‌خواندنی و انتخاب‌شده" />
    </div>
  ),
};

/** Full matrix: status (rows) × fill state (columns). */
export const Matrix: Story = {
  render: () => {
    const STATUS = [
      { name: "Default", props: {} },
      { name: "Error", props: { error: true } },
      { name: "Read-Only", props: { readOnly: true } },
      { name: "Disabled", props: { disabled: true } },
    ] as const;
    const FILL = [
      { name: "Unselected", value: false as const },
      { name: "Selected", value: true as const },
      { name: "Indeterminate", value: "indeterminate" as const },
    ];
    return (
      <table style={{ borderCollapse: "separate", borderSpacing: 20 }}>
        <thead>
          <tr>
            <th />
            {FILL.map((f) => (
              <th key={f.name} style={{ font: "inherit", color: "var(--color-text-subtle)", textAlign: "start" }}>
                {f.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STATUS.map((s) => (
            <tr key={s.name}>
              <td style={{ color: "var(--color-text-subtle)" }}>{s.name}</td>
              {FILL.map((f) => (
                <td key={f.name}>
                  <Checkbox {...s.props} checked={f.value} label="گزینه انتخابی" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
