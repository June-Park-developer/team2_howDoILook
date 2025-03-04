import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      getEntityName() {
        const context = Prisma.getExtensionContext(this);
        return context.$name;
      },
    },
  },
});
export default prisma;
