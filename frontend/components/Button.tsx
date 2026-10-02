import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const baseClasses = [
  "inline-flex items-center justify-center rounded-md px-4 py-2",
  "text-sm font-medium",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

const variantClasses: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white",
  secondary: "border border-gray-300 bg-white text-gray-700",
  danger: "bg-red-600 text-white",
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />;
}
