import { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "light" | "dark" | "blue" | "glass";
}

const variantStyles: Record<NonNullable<SkeletonProps["variant"]>, string> = {
  light: "animate-shimmer bg-slate-200",
  dark: "animate-shimmer-dark bg-white/10",
  blue: "animate-shimmer-blue bg-blue-950/60",
  glass: "animate-shimmer-glass bg-white/15 backdrop-blur-sm",
};

export default function Skeleton({
  className = "",
  variant = "light",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`rounded-md ${variantStyles[variant]} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}
