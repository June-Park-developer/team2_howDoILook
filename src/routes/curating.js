import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { assert } from "superstruct";
import { Password, PatchCuration } from "../utils/structs.js";
import { CreateComment } from "../utils/structs.js";
import prisma from "../utils/prismaClient.js";
import confirmPassword from "../utils/confirmPassword.js";

const curationRouter = express.Router();

curationRouter
  .route("/:curationId")
  .put(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchCuration);
      const { curationId } = req.params;
      const { password } = req.body;
      const modelName = prisma.curation.getEntityName();
      await confirmPassword(modelName, curationId, password);
      const curation = await prisma.curation.update({
        where: { id: curationId },
        data: req.body,
      });
      res.json(curation);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      assert(req.body, Password);
      const { curationId } = req.params;
      const { password } = req.body;
      const modelName = prisma.curation.getEntityName();
      await confirmPassword(modelName, curationId, password);
      await prisma.curation.delete({
        where: { id: curationId },
      });
      res.json({ message: "큐레이팅 삭제 끝" });
    })
  );

curationRouter.route("/:curationId/comments").post(
  asyncHandler(async (req, res) => {
    const { curationId } = req.params;
    assert(req.body, CreateComment);

    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        password: req.body.password,
        curationId: curationId,
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
);

export default curationRouter;
