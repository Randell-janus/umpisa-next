import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

const inputClasses = [
  "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
  "focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800",
].join(" ");

export default function Input({ label, name, id = name, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input id={id} name={name} className={inputClasses} {...props} />
    </div>
  );
}
