import express from "express";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../utils/prismaClient";

const styleRouter = express.Router();

styleRouter.get(
  "/ranking",
  asyncHandler(async (req, res) => {
    const { sort } = req.query;

    const validSortOptions = [
      "trendy",
      "personality",
      "practicality",
      "costEffectiveness",
    ];
    if (sort && !validSortOptions.includes(sort)) {
      return res.status(400).json({
        message:
          " 사용 가능한 정렬값: trendy, personality, practicality, costEffectiveness",
      });
    }
    const orderByOptions = {
      trendy: { trendy: "desc" },
      personality: { personality: "desc" },
      practicality: { practicality: "desc" },
      costEffectiveness: { costEffectiveness: "desc" },
      default: { viewCount: "desc" }, //전체를 viewcount로 설정
    };

    const orderBy = orderByOptions[sort] || orderByOptions.default;

    const rankings = await prisma.style.findMany({
      orderBy: { viewCount: "desc" },
      select: {
        id: true,
        title: true,
        nickname: true,
        tags: true,
        imageUrls: true,
        viewCount: true,
        trendy: true,
        personality: true,
        practicality: true,
        costEffectiveness: true,
        createdAt: true,
      },
    });

    res.send(rankings);
  })
);

export default styleRouter;
