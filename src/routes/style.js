import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { assert } from "superstruct";
import { CreateCuration } from "../utils/structs.js";
import prisma from "../utils/prismaClient.js";

const styleRouter = express.Router();
styleRouter
  .route("/:styleId/curations")
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
      let search;
      switch (searchBy) {
        case "nickname":
          search = { nickname: { contains: keyword } };
          break;
        case "content":
          search = { content: { contains: keyword } };
          break;
        default:
          const e = new Error();
          e.name = "BadRequest"; // ? : 쿼리 가 이상하다는 걸 구체적으로 알려줄 수 없을까?
          throw e;
      }
      const curations = await prisma.curation.findMany({
        skip: offset,
        take: parseInt(pageSize),
        where: { ...search, styleId },
      });
      const totalItemCount = await prisma.curation.count({
        where: { ...search, styleId },
      });
      const totalPages = Math.ceil(totalItemCount / pageSize);
      const currentPage = parseInt(page);
      res.json({ currentPage, totalPages, totalItemCount, data: curations });
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateCuration);
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

export default styleRouter;
