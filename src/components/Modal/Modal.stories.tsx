import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal, ModalClose } from "./Modal";
import { Button } from "../Button";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  args: {
    title: "تأیید پرداخت",
    description: "آیا از پرداخت این قسط اطمینان دارید؟",
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => (
    <Modal
      {...args}
      trigger={<Button>پرداخت قسط</Button>}
      footer={
        <>
          <ModalClose asChild>
            <Button intent="neutral" variant="tonal">انصراف</Button>
          </ModalClose>
          <ModalClose asChild>
            <Button intent="primary">تأیید و پرداخت</Button>
          </ModalClose>
        </>
      }
    >
      <p style={{ margin: 0, color: "var(--color-text-subtle)" }}>
        مبلغ ۲٬۵۰۰٬۰۰۰ ﷼ از حساب شما کسر خواهد شد.
      </p>
    </Modal>
  ),
};

export const DefaultOpen: Story = {
  render: (args) => (
    <Modal
      {...args}
      defaultOpen
      title="خوش آمدید"
      description="این یک پنجره گفتگوی نمونه است."
    />
  ),
};
