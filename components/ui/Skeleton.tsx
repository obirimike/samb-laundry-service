import { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-slate-200 ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}
