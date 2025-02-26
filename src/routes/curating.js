import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateUser, PatchUser, CreateSavedProduct } from "../utils/structs.js";

const prisma = new PrismaClient();
const curationRouter = express.Router();

curationRouter
  .route("styles/:styleId/curations")
  .get(
    asyncHandler(async (req, res) => {
      const { styleId } = req.params;
      const {
        page = 1,
        pageSize = 5,
        searchBy = "content",
        keyword = "",
      } = req.query; // ? : default 값 더 개선시킬 순 없을까?
      const offset = parseInt(pageSize) * (parseInt(page) - 1);
      let where;
      switch (searchBy) {
        case "nickname":
          where = { nickname: { contains: keyword } };
          break;
        case "content":
          where = { content: { contains: keyword } };
          break;
        default:
          throw new Error(); // To-do : 어떤 에러 던질지 결정
      }
      const curations = await prisma.curation.findMany({
        skip: offset,
        take: parseInt(pageSize),
        where,
      });
      res.json(curations);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateCuration); // To-do: CreateCuration 만들고 import
      const { styleId } = req.params;
      const curation = await prisma.curation.create({
        data: {
          ...req.body,
          style: {
            connect: { id: styleId },
          },
        },
      });
      res.status(201).json(curation);
    })
  );

curationRouter
  .route("/curations/:curationId")
  .put(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchCuration); // To-do: PatchCuration 만들고 import
      const { curationId } = req.params;
      const { password } = req.body;
      const matchingCuration = await prisma.curation.findUniqueOrThrow({
        where: { id: curationId },
      });
      if (matchingCuration.password !== password) {
        return res.status(403).json({ message: "비밀번호가 틀렸습니다." }); // ? : 오류처리 개선 필요
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
      assert(req.body, DeleteCuration); // To-do: DeleteCuration 만들고 import하기
      const { curationId } = req.params;
      const { password } = req.body;
      const matchingCuration = await prisma.curation.findUniqueOrThrow({
        where: { id: curationId },
      });
      if (matchingCuration.password !== password) {
        return res.status(403).json({ message: "비밀번호가 틀렸습니다." }); // ? : 오류처리 개선 필요
      }
      const curation = await prisma.curation.delete({
        where: { id: curationId },
      });
      res.json({ message: "큐레이팅 삭제 끝" });
    })
  );

export default curationRouter;
