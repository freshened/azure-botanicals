import type { PrismaClient } from "@prisma/client"

export function slugify(input: string) {
  let s = input
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  if (!s) s = "item"
  return s
}

export async function uniqueCategorySlug(prisma: PrismaClient, base: string) {
  let slug = base
  let n = 0
  while (await prisma.shopCategory.findUnique({ where: { slug } })) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}

export async function uniqueTagSlug(prisma: PrismaClient, base: string) {
  let slug = base
  let n = 0
  while (await prisma.shopTag.findUnique({ where: { slug } })) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}
