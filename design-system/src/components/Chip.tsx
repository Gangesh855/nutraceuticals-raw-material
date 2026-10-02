import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode };

/** A removable pill, used for the botanicals chosen in the sample request ("Amla Extract ×"). */
export function Chip({ className, children, ...rest }: ChipProps) {
  return <button type="button" {...rest} className={cx("chip", className)}>{children} <span aria-hidden="true">×</span></button>;
}
