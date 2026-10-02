import type { ButtonHTMLAttributes } from "react";

export type Variant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const baseClasses = [
  "inline-flex items-center justify-center rounded-md px-4 py-2",
  "text-sm font-medium",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

const variantClasses: Record<Variant, string> = {
  primary: "bg-gray-800 text-white",
  secondary: "border border-gray-300 bg-white text-gray-700",
  danger: "border border-gray-800 bg-white text-gray-800",
};

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${baseClasses} ${variantClasses[variant]} ${className}`;
}

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}
