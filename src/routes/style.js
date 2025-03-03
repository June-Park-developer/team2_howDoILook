import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import fetch from "node-fetch"; // 큐레이팅 점수 가져오기기
import prisma from "../utils/prismaClient.js";

const styleRouter = express.Router();

styleRouter.get(
  "/ranking",
  asyncHandler(async (req, res) => {
    const { sort, page = 1, pageSize = 5 } = req.query;

    const validSortOptions = [
      "total",
      "trendy",
      "personality",
      "practicality",
      "costEffectiveness",
    ];

    if (sort && !validSortOptions.includes(sort)) {
      return res.status(400).json({
        message:
          "잘못된 정렬 기준입니다. 사용 가능한 값: total, trendy, personality, practicality, costEffectiveness",
      });
    }
    const response = await fetch(
      "http://localhost:3000/curations/average-scores"
    );
    const rankings = await response.json();

    rankings.forEach((style) => {
      style.curationCount = style.curation ? style.curation.length : 0;
      style.viewCount = style.viewCount || 0;
    });

    const orderByOptions = {
      total: (a, b) => b.total - a.total,
      trendy: (a, b) => b.avgScores.trendy - a.avgScores.trendy,
      personality: (a, b) => b.avgScores.personality - a.avgScores.personality,
      practicality: (a, b) =>
        b.avgScores.practicality - a.avgScores.practicality,
      costEffectiveness: (a, b) =>
        b.avgScores.costEffectiveness - a.avgScores.costEffectiveness,
    };

    // 첫 화면의 기본 정렬은 전체 ( total: 모든 옵션들의 평균 값 )
    const orderBy = orderByOptions[sort] || orderByOptions["total"];
    rankings.sort(orderBy);

    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const totalItemCount = rankings.length;
    const totalPages = Math.ceil(totalItemCount / pageSizeNum);
    const paginatedRankings = rankings.slice(
      (pageNum - 1) * pageSizeNum,
      pageNum * pageSizeNum
    );

    res.json({
      currentPage: pageNum,
      totalPages,
      totalItemCount,
      data: paginatedRankings,
    });
  })
);

export default styleRouter;
