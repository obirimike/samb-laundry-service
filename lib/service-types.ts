import type { Service } from "@prisma/client";

export type ServiceWithRatings = Service & {
  averageRating: number | null;
  reviewCount: number;
};
