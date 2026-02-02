// scripts/add-selected-col.js

const { PrismaClient } = require("@prisma/client");

// import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.$executeRawUnsafe(`
  ALTER TABLE "Document"
  ADD COLUMN IF NOT EXISTS selected INTEGER NOT NULL DEFAULT 1;
`);
await prisma.$disconnect();
