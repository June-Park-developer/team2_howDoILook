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

curationRouter.get(
  "/average-scores",
  asyncHandler(async (req, res) => {
    const styles = await prisma.style.findMany({
      include: {
        curation: {
          select: {
            trendy: true,
            personality: true,
            practicality: true,
            costEffectiveness: true,
          },
        },
      },
    });

    // 코드 추가(재웅) : 스타일별 평균 점수 계산 API
    const averageScores = styles.map((style) => {
      const totalCuration = style.curation.length;

      const avgScores = totalCuration
        ? {
            trendy:
              style.curation.reduce((sum, c) => sum + c.trendy, 0) /
              totalCuration,
            personality:
              style.curation.reduce((sum, c) => sum + c.personality, 0) /
              totalCuration,
            practicality:
              style.curation.reduce((sum, c) => sum + c.practicality, 0) /
              totalCuration,
            costEffectiveness:
              style.curation.reduce((sum, c) => sum + c.costEffectiveness, 0) /
              totalCuration,
          }
        : { trendy: 0, personality: 0, practicality: 0, costEffectiveness: 0 };

      return {
        styleId: style.id,
        avgScores,
        // 전체 평균 점수 (total) 계산
        total:
          (avgScores.trendy +
            avgScores.personality +
            avgScores.practicality +
            avgScores.costEffectiveness) /
          4,
      };
    });

    res.json(averageScores);
  })
);

export default curationRouter;
