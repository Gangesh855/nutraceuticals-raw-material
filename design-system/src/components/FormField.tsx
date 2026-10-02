import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";

type Base = {
  id: string;
  label: ReactNode;
  /** Span both columns of the form grid. */
  full?: boolean;
};
export type FormFieldProps =
  | (Base & { kind?: "input" } & InputHTMLAttributes<HTMLInputElement>)
  | (Base & { kind: "textarea"; name?: string; placeholder?: string; required?: boolean })
  | (Base & { kind: "select"; name?: string; required?: boolean; options: string[] });

/** A labelled form field: text input (default), select with a "Choose one" placeholder, or textarea. */
export function FormField(props: FormFieldProps) {
  const { id, label, full } = props;
  let control: ReactNode;
  if (props.kind === "textarea") {
    control = <textarea id={id} name={props.name} placeholder={props.placeholder} required={props.required} />;
  } else if (props.kind === "select") {
    control = (
      <select id={id} name={props.name} required={props.required}>
        <option value="">Choose one</option>
        {props.options.map((o) => <option key={o}>{o}</option>)}
      </select>
    );
  } else {
    const { kind: _k, id: _i, label: _l, full: _f, ...input } = props as Base & { kind?: "input" } & InputHTMLAttributes<HTMLInputElement>;
    control = <input id={id} {...input} />;
  }
  return <div className={cx("field", full && "full")}><label htmlFor={id}>{label}</label>{control}</div>;
}
