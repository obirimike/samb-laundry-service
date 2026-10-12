export type ServiceCategory = "CLEANING" | "LAUNDRY";

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  imageUrl?: string | null;
  isActive?: boolean;
}
