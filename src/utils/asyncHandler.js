import { Prisma } from "@prisma/client";

export default function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log("Error occured");
      console.log(e);
      if (
        e.name === "StructError" ||
        (e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002") ||
        e instanceof Prisma.PrismaClientValidationError ||
        (e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2003") ||
        e.name === "FileExtensionError" ||
        e.name === "BadRequest" ||
        e.name === "BadQuery"
      ) {
        res.status(400).send({ message: "잘못된 요청입니다" });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.status(404).send({ message: "존재하지 않습니다" });
      } else if (e.name === "PasswordError") {
        res.status(403).send({ message: "비밀번호가 틀렸습니다" });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}
