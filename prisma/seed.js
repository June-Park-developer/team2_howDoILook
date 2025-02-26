import { PrismaClient } from "@prisma/client";
import { STYLES, CURATINGS, COMMENTS, STYLEITEMS } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.style.deleteMany();
  await prisma.curating.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.styleItem.deleteMany();

  // 목 데이터 삽입
  await prisma.style.createMany({
    data: STYLES,
    skipDuplicates: true,
  });

  await prisma.curating.createMany({
    data: CURATINGS,
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: COMMENTS,
    skipDuplicates: true,
  });

  await prisma.styleItem.createMany({
    data: STYLEITEMS,
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
