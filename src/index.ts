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

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

export { Modal, ModalClose } from "./components/Modal";
export type { ModalProps } from "./components/Modal";

export { Tooltip, TooltipProvider } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";

// Formatting helpers (foundations).
export { toPersianDigits, toLatinDigits, formatRial, RIAL } from "./lib/persian";
export type { FormatRialOptions } from "./lib/persian";
export { cx } from "./lib/cx";
