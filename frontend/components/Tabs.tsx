import Link from "next/link";

type Tab = {
  href: string;
  label: string;
  active: boolean;
};

const baseClasses = "border-b-2 px-1 pb-3 text-sm font-medium";
const activeClasses = "border-gray-800 text-gray-900";
const inactiveClasses = "border-transparent text-gray-500";

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  return (
    <nav className="flex gap-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`${baseClasses} ${tab.active ? activeClasses : inactiveClasses}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
