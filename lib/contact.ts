export type ContactInput = {
  name: string;
  company: string;
  email: string;
  interest: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = { name: 100, company: 120, email: 254, interest: 80, message: 3000 } as const;

export function validateContact(v: ContactInput): FieldErrors {
  const e: FieldErrors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  else if (v.name.length > LIMITS.name) e.name = "Name is too long.";
  if (v.company.length > LIMITS.company) e.company = "Company name is too long.";
  if (!EMAIL_RE.test(v.email.trim()) || v.email.length > LIMITS.email) e.email = "Please enter a valid work email.";
  if (v.interest.length > LIMITS.interest) e.interest = "Invalid selection.";
  if (v.message.trim().length < 10) e.message = "Please tell us a little more (at least 10 characters).";
  else if (v.message.length > LIMITS.message) e.message = "Message is too long.";
  return e;
}
