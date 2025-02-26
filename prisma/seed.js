import { PrismaClient } from "@prisma/client";
import { STYLES, CURATIONS, COMMENTS, CATEGORIES } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.style.deleteMany();
  await prisma.curation.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.category.deleteMany();

  // 목 데이터 삽입
  await prisma.style.createMany({
    data: STYLES,
    skipDuplicates: true,
  });

  await prisma.curation.createMany({
    data: CURATIONS,
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: COMMENTS,
    skipDuplicates: true,
  });

  await prisma.category.createMany({
    data: CATEGORIES,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
