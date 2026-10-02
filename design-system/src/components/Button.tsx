import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

type Common = {
  /** `solid` is the gold call to action; `ghost` is the quiet outlined button for secondary actions. */
  variant?: "solid" | "ghost";
  children?: ReactNode;
};
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
type AsButton = Common & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
export type ButtonProps = AsLink | AsButton;

/**
 * The GK Botanical button. Pass `href` to render a link, otherwise a `<button>`.
 * Use one solid button per view for the main action ("Request samples") and ghost buttons for the rest.
 */
export function Button(props: ButtonProps) {
  const { variant = "solid", className, children, ...rest } = props;
  const cls = cx("btn", variant === "ghost" && "ghost", className);
  if ("href" in rest && rest.href !== undefined) {
    return <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>{children}</a>;
  }
  return <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>{children}</button>;
}
