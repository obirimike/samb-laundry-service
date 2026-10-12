import ServiceCardSkeleton from "./ServiceCardSkeleton";

interface ServiceGridSkeletonProps {
  count?: number;
}

export default function ServiceGridSkeleton({
  count = 6,
}: ServiceGridSkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
}
