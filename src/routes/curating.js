import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { Password, PatchCuration } from "../utils/structs.js";

const prisma = new PrismaClient();
const curationRouter = express.Router();

curationRouter
  .route("/curations/:curationId")
  .put(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchCuration);
      const { curationId } = req.params;
      const { password } = req.body;
      const matchingCuration = await prisma.curation.findUniqueOrThrow({
        where: { id: curationId },
      });
      if (matchingCuration.password !== password) {
        return res.status(403).json({ message: "비밀번호가 틀렸습니다." }); // util로 업데이트 하기
      }
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
      const matchingCuration = await prisma.curation.findUniqueOrThrow({
        where: { id: curationId },
      });
      if (matchingCuration.password !== password) {
        return res.status(403).json({ message: "비밀번호가 틀렸습니다." }); // util로 업데이트하기
      }
      const curation = await prisma.curation.delete({
        where: { id: curationId },
      });
      res.json({ message: "큐레이팅 삭제 끝" });
    })
  );

export default curationRouter;
