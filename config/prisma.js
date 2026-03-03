require("dotenv").config({ quiet: true });

const { PrismaClient } = require("@prisma/client");

let Pool;
let PrismaPg;

try {
  ({ Pool } = require("pg"));
  ({ PrismaPg } = require("@prisma/adapter-pg"));
} catch (error) {
  const missingDriverMessage =
    "Prisma v7 membutuhkan driver adapter PostgreSQL. Install dependency: npm install pg @prisma/adapter-pg";

  module.exports = new Proxy(
    {},
    {
      get() {
        throw new Error(missingDriverMessage);
      },
    }
  );
}

if (Pool && PrismaPg) {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  const adapter = new PrismaPg(new Pool({ connectionString }));
  const prisma = new PrismaClient({ adapter });

  module.exports = prisma;
}
