import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ServiceCategory } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const services = [
  {
    name: "Standard Cleaning",
    slug: "standard-cleaning",
    description:
      "Routine cleaning to help maintain clean, comfortable homes and workplaces.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Deep Cleaning",
    slug: "deep-cleaning",
    description:
      "Detailed cleaning for areas that need more attention than routine cleaning.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Post-Construction Cleaning",
    slug: "post-construction-cleaning",
    description:
      "Cleaning after construction or renovation to prepare a property for use.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Carpet Cleaning",
    slug: "carpet-cleaning",
    description:
      "Carpet cleaning to help remove accumulated dirt and improve cleanliness.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Upholstery Cleaning",
    slug: "upholstery-cleaning",
    description:
      "Cleaning for upholstered furniture and other suitable fabric surfaces.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Move-In / Move-Out Cleaning",
    slug: "move-in-move-out-cleaning",
    description:
      "Cleaning properties before moving in or after moving out.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Pre-Event Cleaning",
    slug: "pre-event-cleaning",
    description:
      "Cleaning and preparation of venues before events.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Post-Event Cleaning",
    slug: "post-event-cleaning",
    description:
      "Cleaning and tidying venues after events.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Disinfection & Sanitization",
    slug: "disinfection-sanitization",
    description:
      "Cleaning and sanitization services tailored to the requirements of a space.",
    category: ServiceCategory.CLEANING,
  },
  {
    name: "Laundry Services",
    slug: "laundry-services",
    description:
      "Laundry services including washing, drying, folding, ironing, and fabric care.",
    category: ServiceCategory.LAUNDRY,
  },
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description,
        category: service.category,
      },
      create: service,
    });
  }

  console.log(`Successfully seeded ${services.length} SAMB services.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed services:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
