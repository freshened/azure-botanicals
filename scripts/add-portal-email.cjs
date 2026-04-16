const { PrismaClient } = require("@prisma/client")

const email = process.argv[2]?.trim().toLowerCase()
if (!email || !email.includes("@")) {
  console.error("Usage: node scripts/add-portal-email.cjs you@example.com")
  process.exit(1)
}

const prisma = new PrismaClient()

async function main() {
  const row = await prisma.portalAllowedEmail.upsert({
    where: { emailNorm: email },
    create: { emailNorm: email },
    update: {},
  })
  console.log("OK", row.emailNorm)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
