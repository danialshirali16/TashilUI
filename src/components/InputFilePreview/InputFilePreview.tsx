import { forwardRef } from "react";
import type { HTMLAttributes, ReactElement } from "react";
import { cx } from "../../lib/cx";
import styles from "./InputFilePreview.module.css";

export type InputFilePreviewType = "image" | "pdf" | "file";
export type InputFilePreviewSize = "large" | "small";

export interface InputFilePreviewProps extends HTMLAttributes<HTMLDivElement> {
  /** File kind — selects the glyph and its colour. @default "image" */
  type?: InputFilePreviewType;
  /** Large (225×135) thumbnail or small (40×40) chip-size. @default "large" */
  size?: InputFilePreviewSize;
  /** Accessible label. Defaults to a Persian description of the file type. */
  label?: string;
}

const DEFAULT_LABEL: Record<InputFilePreviewType, string> = {
  image: "پیش‌نمایش تصویر",
  pdf: "پیش‌نمایش پی‌دی‌اف",
  file: "پیش‌نمایش فایل",
};

/* White folded-corner paper sheet (3:4), drawn on a 72×96 grid. */
const Sheet = () => (
  <svg className={styles.sheet} viewBox="0 0 72 96" fill="none" aria-hidden="true">
    <path
      d="M8 0H48L72 24V88C72 92.4183 68.4183 96 64 96H8C3.58172 96 0 92.4183 0 88V8C0 3.58172 3.58172 0 8 0Z"
      fill="currentColor"
    />
  </svg>
);

/* Type glyphs. Image/file reuse the official icon paths (24 grid); PDF is the Acrobat
   swoosh exported from Figma (32 grid). Each carries its own viewBox; fills inherit the
   per-type colour via `currentColor`. */
const GLYPH: Record<InputFilePreviewType, ReactElement> = {
  image: (
    <svg className={styles.glyph} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 4.75C2 3.23122 3.23122 2 4.75 2H19.25C20.7688 2 22 3.23122 22 4.75V19.25C22 20.7688 20.7688 22 19.25 22H4.75C3.23122 22 2 20.7688 2 19.25V4.75ZM3.5 18.5049V19.1944C3.5 19.5534 3.64385 19.8772 3.87879 20.114C4.11617 20.3532 4.44302 20.5 4.80556 20.5H19.1944C19.9155 20.5 20.5 19.9155 20.5 19.1944V17.9577L15.493 12.8177L11.5303 16.7803C11.264 17.0467 10.8413 17.0742 10.5427 16.8445L7.78297 14.7216L3.5 18.5049ZM20.5 15.808V4.75C20.5 4.05964 19.9404 3.5 19.25 3.5H4.75C4.05964 3.5 3.5 4.05964 3.5 4.75V16.5035L7.25347 13.1879C7.52265 12.9501 7.92261 12.9366 8.20728 13.1555L10.9353 15.254L14.9697 11.2197C15.1115 11.0778 15.3043 10.9987 15.5049 11C15.7055 11.0013 15.8973 11.083 16.0372 11.2267L20.5 15.808ZM8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5C8.82843 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5ZM5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8Z"
        fill="currentColor"
      />
    </svg>
  ),
  file: (
    <svg className={styles.glyph} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.85726 3.5C6.55 3.5 5.50012 4.5501 5.50012 5.83333V18.1667C5.50012 19.4499 6.55003 20.5001 7.85727 20.5001L16.143 20.5C17.4502 20.5 18.5001 19.4499 18.5001 18.1667V9.5H14.2501C13.2836 9.5 12.5001 8.7165 12.5001 7.75V3.5H7.85726ZM14.0001 4.56066V7.75C14.0001 7.88807 14.1121 8 14.2501 8H17.4395L14.0001 4.56066ZM4.00012 5.83333C4.00012 3.71081 5.73247 2 7.85726 2H13.2501C13.449 2 13.6398 2.07902 13.7805 2.21967L19.7805 8.21967C19.9211 8.36032 20.0001 8.55109 20.0001 8.75V18.1667C20.0001 20.2892 18.2678 22 16.143 22L7.85727 22.0001C5.73245 22.0001 4.00012 20.2892 4.00012 18.1667V5.83333Z"
        fill="currentColor"
      />
    </svg>
  ),
  pdf: (
    <svg className={styles.glyph} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M31.3123 20.0709C28.9219 17.5146 22.3949 18.5562 20.8322 18.7455C18.534 16.4731 16.9713 13.7276 16.4197 12.7809C17.247 10.2246 17.7984 7.66838 17.8905 4.92303C17.8905 2.55606 16.9713 0 14.3971 0C13.4779 0 12.6504 0.567875 12.1907 1.32525C11.0876 3.31364 11.5472 7.29 13.2939 11.361C12.2828 14.2959 11.3633 17.1361 8.78931 22.1539C6.12338 23.2897 0.515604 25.9408 0.0558972 28.7812C-0.127905 29.633 0.147798 30.4855 0.791306 31.148C1.43481 31.7161 2.26213 32 3.08964 32C6.49098 32 9.80043 27.1718 12.0988 23.1004C14.0293 22.4379 17.063 21.491 20.0968 20.9229C23.6819 24.1419 26.8076 24.6151 28.4624 24.6151C30.6686 24.6151 31.4961 23.6685 31.7718 22.8163C32.2313 21.8698 31.9556 20.8283 31.3123 20.0709ZM29.0138 21.6805C28.9219 22.3432 28.0948 23.0058 26.6238 22.6272C24.877 22.1539 23.3143 21.3017 21.9354 20.1656C23.1305 19.9761 25.7962 19.6921 27.727 20.0709C28.4624 20.2602 29.1978 20.7336 29.0138 21.6805ZM13.6617 2.17727C13.8455 1.89333 14.1214 1.70404 14.3971 1.70404C15.2244 1.70404 15.4082 2.74535 15.4082 3.59757C15.3163 5.58596 14.9485 7.57394 14.3052 9.46747C12.9261 5.6804 13.202 3.02929 13.6617 2.17727ZM13.4779 20.5443C14.2133 19.0296 15.2246 16.3785 15.5922 15.2423C16.4195 16.6622 17.7984 18.3667 18.534 19.124C18.534 19.2189 15.6841 19.7868 13.4779 20.5443ZM8.0539 24.3314C5.93958 27.929 3.73315 30.2011 2.53803 30.2011C2.35423 30.2011 2.17022 30.1065 1.98642 30.0118C1.71052 29.8223 1.61862 29.5384 1.71052 29.1598C1.98642 27.8343 4.37666 26.0355 8.0539 24.3314Z"
        fill="currentColor"
      />
    </svg>
  ),
};

/**
 * InputFilePreview — the Swiss Army `base/File_Preview` atom: a neutral thumbnail of an
 * uploaded file (image / PDF / generic). An internal building block for the file-upload Input
 * components (not a standalone control). A white folded-corner sheet carries a type glyph
 * tinted with the matching semantic colour. Pure CSS + inline SVG, decorative by default.
 */
export const InputFilePreview = forwardRef<HTMLDivElement, InputFilePreviewProps>(
  function InputFilePreview(
  { type = "image", size = "large", label, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label ?? DEFAULT_LABEL[type]}
      data-type={type}
      data-size={size}
      className={cx(styles.root)}
      {...rest}
    >
      <Sheet />
      {GLYPH[type]}
    </div>
  );
});
