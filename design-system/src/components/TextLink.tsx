import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode };

/** An understated link with a hairline underline, used beside a primary button ("Explore ingredients"). */
export function TextLink({ className, children, ...rest }: TextLinkProps) {
  return <a {...rest} className={cx("textlink", className)}>{children}</a>;
}
