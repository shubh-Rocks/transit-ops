require("dotenv/config");

const { neonConfig } = require("@neondatabase/serverless");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const ws = require("ws");

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("12345678", 10);

  const users = [
    {
      name: "Fleet Manager",
      email: "fleet@demo.com",
      role: Role.FLEET_MANAGER,
    },
    {
      name: "Driver",
      email: "driver@demo.com",
      role: Role.DRIVER,
    },
    {
      name: "Safety Officer",
      email: "safety@demo.com",
      role: Role.SAFETY_OFFICER,
    },
    {
      name: "Financial Analyst",
      email: "finance@demo.com",
      role: Role.FINANCIAL_ANALYST,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password,
        role: user.role,
      },
    });
  }

  console.log(" Demo users seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
