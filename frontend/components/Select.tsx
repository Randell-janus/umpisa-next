import type { SelectHTMLAttributes } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: Option[];
};

const selectClasses = [
  "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
  "focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800",
].join(" ");

export default function Select({ label, name, id = name, options, ...props }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select id={id} name={name} className={selectClasses} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
