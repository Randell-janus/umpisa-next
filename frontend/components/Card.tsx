import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <section className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
      {title && <h2 className="mb-4 text-base font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
