import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
};

const textareaClasses = [
  "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
  "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
].join(" ");

export default function Textarea({ label, name, id = name, rows = 4, ...props }: TextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea id={id} name={name} rows={rows} className={textareaClasses} {...props} />
    </div>
  );
}
