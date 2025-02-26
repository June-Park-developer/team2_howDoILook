import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { assert } from "superstruct";
import { CreateComment, Password } from "../utils/structs.js";
import prisma from "../utils/prismaClient.js";

const commentRouter = express.Router();

async function confirmPassword(commentId, password) {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { commentId },
  });
  if (comment.password != password) {
    const e = new Error();
    e.name = "PasswordError";
    throw e;
  }
}

commentRouter
  .route("/:commentId")
  .put(
    asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      assert(req.body, CreateComment);

      const { content, password } = req.body;
      await confirmPassword(commentId, password);
      const comment = await prisma.comment.update({
        where: { commentId },
        data: {
          content: content,
        },
      });
      console.log(comment);
      //return json struct
      res.send(comment);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      assert(req.body, Password);
      const { password } = req.body;
      await confirmPassword(commentId, password);
      await prisma.user.delete({
        where: { commentId },
      });
      res.send({ message: "답글 삭제 성공" });
    })
  );

export default commentRouter;
