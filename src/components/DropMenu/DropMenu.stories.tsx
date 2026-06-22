import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, expect, waitFor } from "storybook/test";
import { DropMenu } from "./DropMenu";
import type { DropMenuOption } from "./DropMenu";
import { Button } from "../Button";
import { IconChevronDown, IconTypeHash } from "../../icons";

const options: DropMenuOption[] = [
  "گزینهٔ یک",
  "گزینهٔ دو",
  "گزینهٔ سه",
  "گزینهٔ چهار",
  "گزینهٔ پنج",
  "گزینهٔ شش",
  "گزینهٔ هفت",
  "گزینهٔ هشت",
  "گزینهٔ نه",
  "گزینهٔ ده",
].map((label, i) => ({ value: String(i), label }));

const meta: Meta<typeof DropMenu> = {
  title: "Components/DropMenu",
  component: DropMenu,
  args: { items: options, onAddNew: fn(), onValueChange: fn() },
};
export default meta;

type Story = StoryObj<typeof DropMenu>;

/** Single-select with search + add-new footer. Selecting closes the menu. */
export const Default: Story = {
  args: {
    searchable: true,
    searchPlaceholder: "جستجو در سفارش‌ها …",
    addNewLabel: "افزودن چیز جدید",
  },
  render: (args) => {
    const [value, setValue] = useState<string>("");
    return (
      <DropMenu
        {...args}
        value={value}
        onValueChange={(v) => setValue(v as string)}
        trigger={
          <Button intent="neutral" variant="outline" trailingIcon={<IconChevronDown />}>
            {options.find((o) => o.value === value)?.label ?? "انتخاب گزینه"}
          </Button>
        }
      />
    );
  },
};

/** Each option carries a leading icon. */
export const WithIcon: Story = {
  args: { searchable: true, searchPlaceholder: "جستجو در سفارش‌ها …" },
  render: (args) => (
    <DropMenu
      {...args}
      items={options.map((o) => ({ ...o, icon: <IconTypeHash /> }))}
      trigger={
        <Button intent="neutral" variant="outline" trailingIcon={<IconChevronDown />}>
          انتخاب گزینه
        </Button>
      }
    />
  ),
};

/** Multi-select — checkbox rows; the menu stays open as you toggle. */
export const Multiple: Story = {
  args: {
    multiple: true,
    searchable: true,
    searchPlaceholder: "جستجو …",
    addNewLabel: "افزودن چیز جدید",
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(["0", "2"]);
    return (
      <DropMenu
        {...args}
        value={value}
        onValueChange={(v) => setValue(v as string[])}
        trigger={
          <Button intent="neutral" variant="outline" trailingIcon={<IconChevronDown />}>
            {value.length ? `${value.length} مورد انتخاب شده` : "انتخاب چند گزینه"}
          </Button>
        }
      />
    );
  },
};

/** Some options disabled. */
export const WithDisabled: Story = {
  args: { searchable: true },
  render: (args) => (
    <DropMenu
      {...args}
      items={options.map((o, i) => ({ ...o, disabled: i === 1 || i === 3 }))}
      trigger={
        <Button intent="neutral" variant="outline" trailingIcon={<IconChevronDown />}>
          انتخاب گزینه
        </Button>
      }
    />
  ),
};

/** Interaction test — open, filter, select, and confirm the value. */
export const Test: Story = {
  args: { searchable: true, searchPlaceholder: "جستجو …", onValueChange: fn() },
  render: (args) => (
    <DropMenu
      {...args}
      trigger={<Button intent="neutral" variant="outline">باز کردن</Button>}
    />
  ),
  play: async ({ canvas, args, userEvent, step }) => {
    await step("open the menu", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "باز کردن" }));
    });
    const search = await waitFor(() => document.querySelector<HTMLInputElement>('input[type="search"]')!);
    await step("filter to one match", async () => {
      await userEvent.type(search, "ده");
      await waitFor(() =>
        expect(document.querySelectorAll('[role="option"]').length).toBe(1),
      );
    });
    await step("select via keyboard", async () => {
      await userEvent.keyboard("{ArrowDown}{Enter}");
      await expect(args.onValueChange).toHaveBeenCalledWith("9");
    });
  },
};
