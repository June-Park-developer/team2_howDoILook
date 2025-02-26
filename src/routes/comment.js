import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { assert } from "superstruct";
import { CreateComment, Password } from "../utils/structs.js";
import prisma from "../utils/prismaClient.js";

const commentRouter = express.Router();

async function confirmPassword(commentId, password) {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
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
      console.log("after assert");
      const { content, password } = req.body;
      await confirmPassword(commentId, password);
      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          content: content,
        },
        select: {
          id: true,
          password: true,
          content: true,
          createdAt: true,
        },
      });
      res.send(comment);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      assert(req.body, Password);
      const { password } = req.body;
      await confirmPassword(commentId, password);
      await prisma.comment.delete({
        where: { id: commentId },
      });
      res.send({ message: "답글 삭제 성공" });
    })
  );

export default commentRouter;
