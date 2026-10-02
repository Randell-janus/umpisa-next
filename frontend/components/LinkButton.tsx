import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

import { buttonClasses, type Variant } from "./Button";

type LinkButtonProps = LinkProps & {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export default function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
