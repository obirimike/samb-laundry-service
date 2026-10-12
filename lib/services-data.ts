export const SERVICE_DEFAULT_IMAGES: Record<string, string> = {
  "laundry-services":
    "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80",
  "standard-cleaning":
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  "deep-cleaning":
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
  "post-construction-cleaning":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "carpet-cleaning":
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80",
  "upholstery-cleaning":
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  "move-in-move-out-cleaning":
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "pre-event-cleaning":
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  "post-event-cleaning":
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
  "disinfection-sanitization":
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
};

export const SERVICE_HIGHLIGHTS: Record<string, string[]> = {
  "laundry-services": [
    "Washing, drying & folding",
    "Ironing & delicate fabric care",
    "Eco-friendly, gentle detergents",
  ],
  "standard-cleaning": [
    "Dusting, sweeping & mopping",
    "Kitchen & bathroom sanitization",
    "Trash removal & surface tidy-up",
  ],
  "deep-cleaning": [
    "Behind & inside appliances",
    "Tile grout & deep scrub",
    "Baseboards, blinds & fixtures",
  ],
  "post-construction-cleaning": [
    "Fine dust & debris removal",
    "Paint splatter & residue touch-up",
    "Move-in ready space handover",
  ],
  "carpet-cleaning": [
    "Deep fiber dirt extraction",
    "Tough stain & odor neutralizer",
    "Fast drying process",
  ],
  "upholstery-cleaning": [
    "Fabric & leather sofas",
    "Steam & gentle shampooing",
    "Allergen & dust mite elimination",
  ],
  "move-in-move-out-cleaning": [
    "Cabinets & drawer interiors",
    "Complete appliance cleaning",
    "Deposit-guarantee standards",
  ],
  "pre-event-cleaning": [
    "Venue staging & floor buffing",
    "Restroom & common area prep",
    "Welcoming, fresh ambiance",
  ],
  "post-event-cleaning": [
    "Trash clearing & recycling",
    "Full venue restoration",
    "Fast overnight turnaround",
  ],
  "disinfection-sanitization": [
    "Hospital-grade disinfectants",
    "High-touch point fogging",
    "Safe for kids and pets",
  ],
};

export function getServiceImageUrl(
  slug: string,
  category: string,
  customUrl?: string | null
): string {
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl;
  }

  if (SERVICE_DEFAULT_IMAGES[slug]) {
    return SERVICE_DEFAULT_IMAGES[slug];
  }

  return category === "LAUNDRY"
    ? "/images/services/laundry-default.svg"
    : "/images/services/cleaning-default.svg";
}

export function getServiceHighlights(slug: string, category: string): string[] {
  if (SERVICE_HIGHLIGHTS[slug]) {
    return SERVICE_HIGHLIGHTS[slug];
  }

  return category === "LAUNDRY"
    ? ["Professional wash & fold", "Gentle fabric care", "Reliable scheduling"]
    : ["Thorough surface cleaning", "Quality inspected", "Flexible scheduling"];
}
