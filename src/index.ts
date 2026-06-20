// TashilUI — public API.
// Import the styles once in your app: `import "tashil-ui/styles/global.css"`.

export { Button } from "./components/Button";
export type {
  ButtonProps,
  ButtonIntent,
  ButtonVariant,
  ButtonSize,
} from "./components/Button";

export { TextField } from "./components/TextField";
export type { TextFieldProps } from "./components/TextField";

export { TextArea } from "./components/TextArea";
export type { TextAreaProps } from "./components/TextArea";

export { TextFieldSmall } from "./components/TextFieldSmall";
export type { TextFieldSmallProps } from "./components/TextFieldSmall";

export { OTPField } from "./components/OTPField";
export type { OTPFieldProps } from "./components/OTPField";

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

export { CheckboxGroup } from "./components/CheckboxGroup";
export type { CheckboxGroupProps } from "./components/CheckboxGroup";

export { RadioButton } from "./components/RadioButton";
export type { RadioButtonProps } from "./components/RadioButton";

export { RadioGroup } from "./components/RadioGroup";
export type { RadioGroupProps } from "./components/RadioGroup";

export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";

export { Modal, ModalClose } from "./components/Modal";
export type { ModalProps } from "./components/Modal";

export { Tooltip, TooltipProvider } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";

// Formatting helpers (foundations).
export { toPersianDigits, toLatinDigits, formatRial, RIAL } from "./lib/persian";
export type { FormatRialOptions } from "./lib/persian";
export { groupThousands, THOUSANDS_SEPARATOR } from "./lib/numericInput";
export type { TextInputMode } from "./lib/numericInput";
export { cx } from "./lib/cx";
