import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode };

/** Small uppercase label that sits above a heading, e.g. "Quality" or "Ingredients · Fifteen standardized extracts". */
export function Eyebrow({ className, children, ...rest }: EyebrowProps) {
  return <p {...rest} className={cx("eyebrow", className)}>{children}</p>;
}
