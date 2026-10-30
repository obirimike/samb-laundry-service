import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const connectionString = process.env.ADMIN_DATABASE_URL?.trim();
const caCertificate = process.env.SUPABASE_CA_CERT_BASE64;
const name = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!connectionString || !caCertificate || !name || !email || !password) {
  throw new Error("Required admin creation environment variables are missing.");
}

if (password.length < 12) {
  throw new Error("Admin password must contain at least 12 characters.");
}

const adminName = name;
const adminEmail = email;
const adminPassword = password;

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    ca: Buffer.from(caCertificate, "base64").toString("utf8"),
    rejectUnauthorized: true,
  },
});

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    throw new Error(
      "An account with this email already exists. No changes were made."
    );
  }

  const passwordHash = await hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin account created successfully: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(
      "Admin account creation failed:",
      error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
