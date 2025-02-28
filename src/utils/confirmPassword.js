import prisma from "./prismaClient.js";

async function confirmPassword(table, id, password) {
  const record = await prisma[table].findUniqueOrThrow({
    where: { id },
  });
  if (record.password !== password) {
    const e = new Error();
    e.name = "PasswordError";
    throw e;
  }
}

export default confirmPassword;
