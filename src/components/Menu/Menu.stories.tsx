import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Menu, MenuSection, MenuRadioGroup, MenuRadioItem } from "./Menu";
import { MenuItem } from "../MenuItem";
import { Button } from "../Button";
import { IconCopy, IconChevronDown } from "../../icons";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
};
export default meta;

type Story = StoryObj<typeof Menu>;

const Trigger = (
  <Button intent="neutral" variant="outline" trailingIcon={<IconChevronDown />}>
    منو
  </Button>
);

/** Three sections of actions, separated by dividers (mirrors the Figma Menu). */
export const Default: Story = {
  render: () => (
    <Menu trigger={Trigger}>
      {[0, 1, 2].map((s) => (
        <MenuSection key={s}>
          {Array.from({ length: 5 }).map((_, i) => (
            <MenuItem key={i} icon={<IconCopy />} onSelect={fn()}>
              کپی
            </MenuItem>
          ))}
        </MenuSection>
      ))}
    </Menu>
  ),
};

/** Actions, multi-select checkboxes, a radio group (our RadioGroup + RadioButton), and a
 *  destructive action — each in its own section. */
export const Mixed: Story = {
  render: () => {
    const [details, setDetails] = useState(true);
    const [sort, setSort] = useState("asc");
    return (
      <Menu trigger={Trigger}>
        <MenuSection>
          <MenuItem icon={<IconCopy />} onSelect={fn()}>
            کپی
          </MenuItem>
          <MenuItem type="no-icon" selected onSelect={fn()}>
            مورد انتخاب‌شده
          </MenuItem>
        </MenuSection>
        <MenuSection>
          <MenuItem type="checkbox" selected={details} onCheckedChange={setDetails}>
            نمایش جزئیات
          </MenuItem>
        </MenuSection>
        <MenuSection>
          <MenuRadioGroup value={sort} onValueChange={setSort}>
            <MenuRadioItem value="asc">صعودی</MenuRadioItem>
            <MenuRadioItem value="desc">نزولی</MenuRadioItem>
          </MenuRadioGroup>
        </MenuSection>
        <MenuSection>
          <MenuItem type="destructive" icon={<IconCopy />} onSelect={fn()}>
            حذف
          </MenuItem>
        </MenuSection>
      </Menu>
    );
  },
};

/** Add/remove sections dynamically. */
export const DynamicSections: Story = {
  render: () => {
    const [count, setCount] = useState(2);
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <Button intent="neutral" variant="outline" onClick={() => setCount((c) => c + 1)}>
          + بخش
        </Button>
        <Button
          intent="neutral"
          variant="outline"
          onClick={() => setCount((c) => Math.max(1, c - 1))}
        >
          − بخش
        </Button>
        <Menu trigger={Trigger}>
          {Array.from({ length: count }).map((_, s) => (
            <MenuSection key={s}>
              <MenuItem icon={<IconCopy />} onSelect={fn()}>{`بخش ${s + 1}`}</MenuItem>
              <MenuItem icon={<IconCopy />} onSelect={fn()}>کپی</MenuItem>
            </MenuSection>
          ))}
        </Menu>
      </div>
    );
  },
};
