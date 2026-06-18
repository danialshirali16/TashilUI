import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "./Button";
import type { ButtonIntent, ButtonVariant } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "متن دکمه",
    intent: "primary",
    variant: "solid",
    size: "md",
    onClick: fn(),
  },
  argTypes: {
    intent: {
      control: "select",
      options: ["primary", "secondary", "neutral", "success", "error"],
    },
    variant: {
      control: "select",
      options: ["solid", "tonal", "outline", "ghost", "link"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

const INTENTS: ButtonIntent[] = ["primary", "secondary", "neutral", "success", "error"];
const VARIANTS: ButtonVariant[] = ["solid", "tonal", "outline", "ghost", "link"];

export const Playground: Story = {};

/** Full matrix: every Style (rows) × Intent (columns). */
export const Matrix: Story = {
  render: (args) => (
    <table style={{ borderCollapse: "separate", borderSpacing: 12 }}>
      <thead>
        <tr>
          <th />
          {INTENTS.map((i) => (
            <th key={i} style={{ font: "inherit", color: "var(--color-text-subtle)" }}>
              {i}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {VARIANTS.map((v) => (
          <tr key={v}>
            <td style={{ color: "var(--color-text-subtle)" }}>{v}</td>
            {INTENTS.map((i) => (
              <td key={i}>
                <Button {...args} intent={i} variant={v}>
                  متن دکمه
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button {...args} size="sm">کوچک</Button>
      <Button {...args} size="md">متوسط</Button>
      <Button {...args} size="lg">بزرگ</Button>
    </div>
  ),
};

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button {...args} leadingIcon={<Plus />}>افزودن</Button>
      <Button {...args} trailingIcon={<Chevron />}>ادامه</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: { iconOnly: true, "aria-label": "افزودن" },
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button {...args} size="sm"><Plus /></Button>
      <Button {...args} size="md"><Plus /></Button>
      <Button {...args} size="lg"><Plus /></Button>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button {...args}>عادی</Button>
      <Button {...args} loading>در حال ارسال</Button>
      <Button {...args} disabled>غیرفعال</Button>
    </div>
  ),
};

/** Loading: label is hidden (width preserved) and a centered spinner shows. */
export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button {...args} size="sm">کوچک</Button>
      <Button {...args} size="md">متوسط</Button>
      <Button {...args} size="lg">بزرگ</Button>
      <Button {...args} variant="tonal">تونال</Button>
      <Button {...args} variant="outline">اوت‌لاین</Button>
      <Button {...args} iconOnly aria-label="در حال بارگذاری">
        <Plus />
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fill: true, children: "ورود به حساب" },
  render: (args) => (
    <div style={{ inlineSize: 320 }}>
      <Button {...args} />
    </div>
  ),
};

/* ── Interaction tests (run in the Storybook "Interactions" panel) ──────────── */

/** A click on an enabled button fires `onClick` exactly once. */
export const ClickFiresOnClick: Story = {
  name: "Test: click fires onClick",
  args: { children: "کلیک کنید" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "کلیک کنید" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** A loading button is disabled and swallows clicks (no `onClick`). The loading
 *  button sets `pointer-events: none`, so bypass user-event's pointer guard
 *  (`pointerEventsCheck: 0`) to dispatch the click and prove it's still inert. */
export const LoadingBlocksClick: Story = {
  name: "Test: loading blocks interaction",
  args: { loading: true, children: "در حال ارسال" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** A disabled button cannot be activated by click. */
export const DisabledBlocksClick: Story = {
  name: "Test: disabled blocks interaction",
  args: { disabled: true, children: "غیرفعال" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "غیرفعال" });
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
