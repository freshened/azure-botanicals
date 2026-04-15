const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  const raw = process.env.PORTAL_SEED_EMAILS || ""
  const emails = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((e) => e.length > 0 && e.includes("@"))

  for (const emailNorm of emails) {
    await prisma.portalAllowedEmail.upsert({
      where: { emailNorm },
      create: { emailNorm },
      update: {},
    })
  }

  if (emails.length > 0) {
    console.log(`Seeded ${emails.length} portal allowed email(s).`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
